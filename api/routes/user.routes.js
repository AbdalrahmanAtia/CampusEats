import { Router } from "express";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/user.validators.js";
import {
  getCategories,
  getProducts,
  getRestaurants,
  loginUser,
  registerUser,
  updateUser,
  uploadOtherImages,
  uploadUserProfile,
  getMainCategories,
  getRestaurantRecommendations,
} from "../controllers/user.controllers.js";
import { validate } from "../validators/validate.js";
import { verifyJwt } from "../middlewares/jwt.authMiddleware.js";
import { placeOrderValidator } from "../validators/order.validator.js";
import {
  getAllUserOrders,
  placeOrder,
} from "../controllers/order.controller.js";
import axios from 'axios';
import qs from 'querystring';

import dotenv from "dotenv";
import { registerStudent } from "../controllers/student.controller.js";
dotenv.config();


const router = Router();

// Microsoft OAuth config

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI;

// Route to upload profile pic
router.route("/upload-profile").post(verifyJwt, uploadUserProfile);

// Route to upload product and other images
router.route("/upload-images").post(verifyJwt, uploadOtherImages);

// User routes
//router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/register").post(userRegisterValidator(), registerStudent);


router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/updateuser").patch(validate, verifyJwt, updateUser);
router.route("/get-products").get(validate, verifyJwt, getProducts);
router.route("/get-restaurants").get(validate, verifyJwt, getRestaurants);
router.route("/get-categories").get(validate, verifyJwt, getCategories);
router.route("/get-main-categories").get(validate, verifyJwt, getMainCategories);

router.route("/order").get(validate, verifyJwt, getAllUserOrders);
router.route("/order").post(placeOrderValidator(), validate, verifyJwt, placeOrder);

router.route("/recommendRestaurants").get(validate, verifyJwt, getRestaurantRecommendations);


// Validate environment variables
if (!MICROSOFT_CLIENT_ID || !MICROSOFT_CLIENT_SECRET || !MICROSOFT_REDIRECT_URI) {
  console.error('Microsoft OAuth environment variables are missing.');
  process.exit(1); // Exit if required variables are missing
}

// Get Microsoft login URL
router.get('/microsoft', (req, res) => {
  const params = {
    client_id: MICROSOFT_CLIENT_ID,
    response_type: 'code',
    redirect_uri: MICROSOFT_REDIRECT_URI,
    scope: 'openid profile email User.Read',
  };

  console.log('Microsoft OAuth params:', params);
  res.json({
    url: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${qs.stringify(params)}`,
  });
});

// Handle Microsoft callback
router.get('/microsoft/callback', async (req, res) => {
  try {
    const { code } = req.query;
    

    // Validate required parameters
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing." });
    }

    // Token endpoint URL
    const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

    // Request body parameters
    const params = new URLSearchParams();
    params.append('client_id', MICROSOFT_CLIENT_ID);
    params.append('client_secret', MICROSOFT_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', MICROSOFT_REDIRECT_URI);
    params.append('grant_type', 'authorization_code');

    console.log('Exchanging code for access token...');

    // Exchange code for access token
    const tokenResponse = await axios.post(
      tokenUrl,
      params.toString(), // Send as URL-encoded form data
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Check for error in response
    if (tokenResponse.status !== 200) {
      console.error('Error exchanging code for token:', tokenResponse.data);
      return res.status(500).json({ error: 'Failed to exchange code for token' });
    }
  
    console.log('Access token received:', tokenResponse.data.access_token);

    // Get user profile
    const profileResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
    });

    // Check for error in response
    if (profileResponse.status !== 200) {
      console.error('Error getting user profile:', profileResponse.data);
      return res.status(500).json({ error: 'Failed to get user profile' });
    }

    res.json({
      email: profileResponse.data.mail,
      domain: profileResponse.data.mail.split('@')[1],
    });
  } catch (error) {
    console.error('Microsoft OAuth error:');
    if (error.response) {
       // The request was made and the server responded with a status code
       // that falls out of the range of 2xx
       console.error('Error Response Status:', error.response.status);
       console.error('Error Response Headers:', error.response.headers);
       console.error('Error Response Data:', error.response.data);
   } else if (error.request) {
       // The request was made but no response was received
       console.error('Error Request:', error.request);
   } else {
       // Something happened in setting up the request that triggered an Error
       console.error('Error Message:', error.message);
   }
   console.error('Error Config:', error.config); // Log config to see details about the request
   res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;
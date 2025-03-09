import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { filterObject } from "../utils/helper.js";
import { ProductModel } from "../models/product.model.js";
import { RestaurantModel } from "../models/restaurant.model.js";
import { categoriesModel } from "../models/categories.model.js";
import { imagesUpload, profileUpload } from "../utils/multerSetup.js";
import dotenv from "dotenv";
import axios from "axios";

//import { Configuration, OpenAIApi } from 'openai';

import OpenAI from 'openai';
import { StudentModel } from "../models/student.model.js";

//console.log("api key: ", process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai2 = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-c68ba54c43d64a4ca0146ef5f2a6a209'
});

// // OpenAI Configuration
// const configuration = new Configuration({
//   apiKey: `${process.env.OPENAI_API_KEY}`
// });
// const openai = new OpenAIApi(configuration);



// Prepare Data for ChatGPT API
const prepareChatGPTPrompt = async (data, userUniversity) => {

  
  const userPreferences = data.userPreferences[0]; // Get the first user preference for simplicity

  // const prompt = `
  //   Based on the following data, recommend the top 3 restaurants:

  //   User Preferences:
  //   - Vegetarian: ${userPreferences.vegetarian}
  //   - Favorite categories: ${userPreferences.categoryName}
  //   - User ratings for food items: ${userPreferences.productName}: ${userPreferences.rating}

  //   Popularity Data (based on total orders):
  //   ${data.popularRestaurants.map(r => `${r.name}: ${r.popularity}`).join(', ')}

  //   Top Rated Restaurants (rating >= 4.5):
  //   ${data.topRatedRestaurants.map(r => `${r.name}: ${r.rating}`).join(', ')}

  //   Location-based Restaurants (User location is ${userUniversity}):
  //   ${data.locationBasedRestaurants.map(r => `${r.name}: ${r.university}`).join(', ')}

  //   Trendy Restaurants (based on recent orders):
  //   ${data.trendyRestaurants.map(r => `${r.name}: ${r.orderCount}`).join(', ')}

  //   Please suggest the top 3 restaurants based on these factors (user preferences, popularity, ratings, location, and trends).
  // `;


    const prompt = `
    Based on the following data, recommend the top 3 restaurants:

    User Preferences:
    - Vegetarian: ${userPreferences.vegetarian? "yes": "no"}
    - Favorite categories: ${userPreferences.categoryName}
    - User ratings for food items: ${userPreferences.productName}: ${userPreferences.rating}

    Popularity Data (based on total orders):
    ${data.popularRestaurants.map(r => `${r.name}: ${r.popularity}`).join(', ')}

    Top Rated Restaurants (rating >= 4.5):
    ${data.topRatedRestaurants.map(r => `${r.name}: ${r.rating}`).join(', ')}

    Location-based Restaurants (User location is ${userUniversity}):
    ${data.locationBasedRestaurants.map(r => `${r.name}: ${r.university}`).join(', ')}

    Trendy Restaurants (based on recent orders):
    ${data.trendyRestaurants.map(r => `${r.name}: ${r.orderCount}`).join(', ')}

    Provide only the names of the top 3 recommended restaurants in a comma-separated form and even in the case of insuffiecient data, provide 1-3 names at least. Don't give me sentence or any text other than the three restaurant names.
  `;

  console.log("Prompt: \n\n", prompt); // Ensure this logs a string, not a Promise
  return prompt;

}


const callDeepSeek = async (prompt) => {
  console.log("\n\n\n\n");
  console.log("Sending prompt to DeepSeek API: \n\n", prompt);
  console.log("\n\n\n\n");

  const apiUrl = ' https://api.deepseek.com/v1'; // Example API URL, replace with actual URL
  const apiKey = 'sk-c68ba54c43d64a4ca0146ef5f2a6a209'; // Replace with your actual API key

  try {
    const response = await axios.post(apiUrl, {
      prompt: prompt
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Assuming the response contains a list of restaurant names
    const recommendations = response.data.recommendations; // Replace with correct path in the response
    
    //return recommendations;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return 'Error occurred while fetching recommendations.';
  }
};


//Call ChatGPT API
const callChatGPT = async (prompt) => {

  console.log("\n\n\n\n");

  console.log("prompt: \n\n", prompt);

  console.log("\n\n\n\n");
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',  // You can use 'gpt-3.5-turbo' or 'gpt-4'
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });

    // const response = await openai2.chat.completions.create({
    //   messages: [{ role: "system", content: prompt }],
    //   model: "deepseek-chat",
    // });
  
    //console.log(response.choices[0].message.content);

    // Extracting top 3 restaurant names from the response
    const recommendations = response.choices[0].message.content
    .split(',')
    .map(name => name.trim())
    .slice(0, 3);
    return recommendations;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return 'Error occurred while fetching recommendations.';
  }
}

// Main Function to Integrate Everything
const getRestaurantRecommendations = asyncHandler(async (req, res, next) => {
  const { userId } = req.query;  // Get userId from query params

  //console.log("ahmeeeeed");
  //console.log("userrrrr: ", userId);

  let student;
  let userUniversity;

  if (userId) {
    // Ensure that this function returns a valid student or null
    student = await StudentModel.getStudentByUserId(userId); 

    // Check if student exists
    if (!student) {
      return next(new ApiError(404, "Student not found"));
    }

    userUniversity = student.university;  // Now we know student is not undefined or null

  } else {
    // If no userId, use default values
    userId = "a925e8c7-d2fc-4dd6-adb9-0bde91e0e8db";
    userUniversity = "Cairo University";
  }

  //console.log("user id: ", userId);
  //console.log("user university: ", userUniversity);

  try {
    // Fetch data from DB
    const data = await UserModel.fetchData(userId, userUniversity);

    console.log("\n\n\n\n");
    console.log("data: \n\n", data);
    console.log("\n\n\n\n");

    // Prepare the data for the ChatGPT API
    const prompt = await prepareChatGPTPrompt(data, userUniversity);

    // Get the recommendations from ChatGPT
    const restaurantRecommendations = await callChatGPT(prompt);

    console.log('Top 3 Restaurant Recommendations:');
    console.log(restaurantRecommendations);

    if (!restaurantRecommendations) {
      throw new ApiError(404, "recommendations not found");
    }

    
    // Fetch restaurant details for each recommended restaurant name
    const restaurants = [];
    for (let i = 0; i < restaurantRecommendations.length; i++) {
      const restaurant = await RestaurantModel.getRestaurantsByName(restaurantRecommendations[i]);
      if (restaurant) {
        restaurants.push(restaurant);
      }
    }

    console.log("Recommendations: ", restaurants.flat());

    const recommendations = restaurants.flat();

    return res.status(200).json(
      new ApiResponse(200, {restaurants: recommendations }, "recommendations fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating recommendations");
  }
});



// // Function to call OpenAI API
// async function getRestaurantRecommendations(userHistory, restaurants) {
//   const prompt = `Given the user's order history: ${JSON.stringify(userHistory)}, suggest three restaurants from this list: ${JSON.stringify(restaurants)}`;
  
//   try {
//       const response = await axios.post("https://api.openai.com/v1/chat/completions", {
//           model: "gpt-4",
//           messages: [{ role: "user", content: prompt }],
//           max_tokens: 100,
//       }, {
//           headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
//       });

//       return response.data.choices[0].message.content;
//   } catch (error) {
//       console.error("Error fetching recommendations:", error.response?.data || error.message);
//       return "Error generating recommendations";
//   }
// }

// // API route to get recommendations
// router.post("/recommend", async (req, res) => {
//   const { userHistory, restaurants } = req.body;

//   if (!userHistory) {
//       return res.status(400).json({ error: "User history is required" });
//   }

//   const recommendations = await getRestaurantRecommendations(userHistory, restaurants);
//   res.json({ recommendations });
// });


// generating the jwt access token
const generateAccessToken = async (userId) => {
  try {
    const user = await UserModel.getUserById(userId);

    const accessToken = await UserModel.generateAccessToken(user);
    // for future purpose
    // const refreshToken = await UserModel.getRefreshToken(user);

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access token"
    );
  }
};

const getAllUsers = asyncHandler(async (req, res) => {
  // get all users from db
  const users = await UserModel.getAllUsers();

  if (!users) {
    throw new ApiError(404, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { users: users }, "users fetched successfully"));
});

const registerUser = async (username, email, password, phoneNumber, role) => {

  if (!username || !email || !password || !phoneNumber || !role) {
    console.error("Missing required fields");
    throw new ApiError(400, "Please provide all required fields");
  }
  

  // check if user is already registered
  const existingUser = await UserModel.getUserByEmail(email);

  // throw an error if use exists
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // if not user existes create new user
  const createdUser = await UserModel.createUser(username, email, password, phoneNumber, role);

  const { password: pass, ...rest } = createdUser;



  if (!createdUser) {
    throw new ApiError(500, "something went wrong registering  user");
  }

  // if user is authenticated, create jwt token
  const { accessToken } = await generateAccessToken(createdUser.userId);

  // add more options to make cookie more secure and reliable
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 86400000),
  };

  //console.log("Created user -------------------", createdUser);
  return {createdUser, accessToken, options};
};

// user login route
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // check if user exists
  const existesUser = await UserModel.getUserForLogin(email);

  if (!existesUser) {
    throw new ApiError(404, "User not found");
  }

  // check if password is valid
  const isPasswordValid = await bcrypt.compare(password, existesUser.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  if (existesUser.role !== role) {
    throw new ApiError(401, "This login is for " + role + "s only, please login from the " + existesUser.role + "s login page");
  }

  // if user is authenticated, create jwt token
  const { accessToken } = await generateAccessToken(existesUser.userId);

  // get the user document ignoring the password and other fields
  const { password: pass, ...rest } = existesUser; // ignore rename of pass field

  // add more options to make cookie more secure and reliable
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 86400000),
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token
    .json(
      new ApiResponse(
        200,
        { user: rest, accessToken },
        "User logged in successfully"
      )
    ); // excluded pass field and return user with access token
});

// upload user images
const uploadUserProfile = (req, res) => {
  profileUpload.single("file")(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a valid image" });
    }

    res.status(201).json({ message: "Image uploaded successfully" });
  });
};

// upload product and other images
const uploadOtherImages = (req, res) => {
  imagesUpload.single("file")(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a valid image" });
    }

    res.status(201).json({ message: "Image uploaded successfully" });
  });
};

const updateUser = asyncHandler(async (req, res) => {
  let updateFields = req.body;

  // filter fields that are allowd to be udpated
  // updateFields = filterObject(updateFields, [
  //   "username",
  //   "avatar",
  //   "password",
  //   "email",
  // ]);

  if (
    updateFields.hasOwnProperty("oldPassword") &&
    updateFields.hasOwnProperty("newPassword")
  ) {
    const user = await UserModel.getUserById(req?.user.userId);

    // console.log("getuserbyid user", user);

    const isPasswordValid = await bcrypt.compare(
      updateFields.oldPassword,
      user.password
    );

    // throw an error if the old password is not valid
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const hashedPassword = await bcrypt.hash(
      updateFields.newPassword,
      10
      // process.env.BCRYPT_HASH_ROUNDS
    );

    // delete the old password and new password
    delete updateFields["oldPassword"];
    delete updateFields["newPassword"];

    updateFields["password"] = hashedPassword; // update the new hashed password field
  }

  const updatedUser = await UserModel.updateUser(
    req?.user?.userId,
    updateFields
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  const { password, role, ...rest } = updatedUser;

  return res
    .status(201)
    .json(new ApiResponse(201, { user: rest }, "User updated successfully"));
});

const getProducts = asyncHandler(async (req, res, next) => {
  // destructure the req query parameters
  const { productId, productName, categoryName, categoryId, restaurantId } = req.query;

  let products = {};

  // get the products by productId
  if (productId) {
    products = await ProductModel.getProductById(productId);
  }

  // get the products by productName
  if (productName) {
    products = await ProductModel.getProductsByName(productName);
  }

  // get products by categoryName
  if (categoryName) {
    products = await ProductModel.getProductsByCategoryName(categoryName);
  }

  // get product by category Id
  if (categoryId) {
    products = await ProductModel.getProductsByCategoryId(categoryId);
  }

  if(restaurantId){
    products = await ProductModel.getProductsByRestaurantId(restaurantId);
  }

  // get all products
  if (!productId && !productName && !categoryName && !categoryId && !restaurantId) {
    products = await ProductModel.getAllProducts();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products: products },
        "products fetched successfully"
      )
    );
});


const getRestaurants = asyncHandler(async (req, res, next) => {
  // destructure the req query parameters
  const { restaurantId, restaurantName, categoryId} = req.query;

  let restaurants = {};

  // get the restaurants by restaurantId
  if (restaurantId) {
    restaurants = await RestaurantModel.getRestaurantById(restaurantId);
  }

  // get the restaurants by restaurantName
  if (restaurantName) {
    restaurants = await RestaurantModel.getRestaurantsByName(restaurantName);
  }

  if(categoryId){
    restaurants = await RestaurantModel.getRestaurantsByCategory(categoryId);
  }

  // // get restaurants by categoryName
  // if (categoryName) {
  //   restaurants = await RestaurantModel.getRestaurantsByCategoryName(categoryName);
  // }

  // // get restaurant by category Id
  // if (categoryId) {
  //   restaurants = await RestaurantModel.getRestaurantsByCategoryId(categoryId);
  // }

  // get all restaurants
  if (!restaurantId && !restaurantName && !categoryId) {
    restaurants = await RestaurantModel.getAllRestaurants();
  }

  console.log("restaurants 1:", restaurants);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { restaurants: restaurants },
        "restaurants fetched successfully"
      )
    );
});

const getCategories = asyncHandler(async (req, res, next) => {
  const { categoryId, categoryName, restaurantId } = req.query;

  let categories = null;

  try {
    if (categoryId) {
      categories = await categoriesModel.getCategoryById(categoryId);
    } 
    
    else if (categoryName) {
      categories = await categoriesModel.getCategoryByName(categoryName);
    } 
    
    else if (restaurantId) {
      categories = await categoriesModel.getCategoriesByRestaurantId(restaurantId);

      // if (!categories || categories.length === 0) {
      //   const mainCategories = await categoriesModel.getMainCategories();
      //   categories = mainCategories.find((item) => item.categoryName === "View All") || [];
      // }
    } 
    
    else {
      categories = await categoriesModel.getAllCategories();
    }


    //console.log("Categories: ", categories);
    return res.status(200).json(
      new ApiResponse(200, { categories: categories || [] }, "Categories fetched successfully")
    );
  } catch (error) {
    return next(error); // Pass error to Express error handler
  }
});


const getMainCategories = asyncHandler(async (req, res, next) => {
  

  const categories = await categoriesModel.getMainCategories();

  //console.log("categories--------- hellooooo/n", categories);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categories: categories },
        "categories fetched successfully"
      )
    );
});

export {
  uploadUserProfile,
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  getProducts,
  getRestaurants,
  getCategories,
  uploadOtherImages,
  getMainCategories,
  getRestaurantRecommendations,
  prepareChatGPTPrompt,
  callChatGPT,
};

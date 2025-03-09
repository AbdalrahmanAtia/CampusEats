import { categoriesModel } from "../models/categories.model.js";
import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";
import {getCategories, registerUser} from "../controllers/user.controllers.js";
import { RestaurantModel } from "../models/restaurant.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { filterObject } from "../utils/helper.js";

const createCategory = asyncHandler(async (req, res) => {
  const { categoryName, categoryDesc, categoryImage, restaurantId } = req.body;

 // console.log("category Name" + categoryName + ", categoryDesc: " + categoryDesc + ", categoryImage" + categoryImage + ", restaurantId" + restaurantId);
  if (!categoryName && !categoryDesc && !restaurantId && !categoryImage)
    throw new ApiError(400, "provide a category name and description");

  const categoryRes = await categoriesModel.createCategory(
    categoryName,
    categoryDesc,
    categoryImage,
    restaurantId,
  );

  if (!categoryRes) {
    throw new ApiError(500, "error creating category");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "category created successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
  const productDetails = req.body;

  const newProduct = await ProductModel.createProduct(productDetails);

  if (!newProduct) {
    throw new ApiError(500, "something went wrong while creating product");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { product: newProduct },
        "product created successfully"
      )
    );
});

const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updateFields = req.body;

    // Validate request body
    if (!productId || Object.keys(updateFields).length === 0) {
      throw new ApiError(400, "Product ID and update fields are required");
    }

    // Call the service function to update the product
    const updatedProduct = await ProductModel.updateProducts(productId, updateFields);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const delProdResult = await ProductModel.deleteProductById(productId);
  if (!delProdResult) {
    throw new ApiError(500, "product not found or something went wrong");
  }

  // return success if product was successfully deleted
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

const restaurantData = [ 
  {
    username: "koshary_el_tahrir",
    email: "tahrir@example.com",
    password: "Koshary123!",
    phoneNumber: "01000000001",
    name: "Koshary El Tahrir",
    location: "Giza Square, Cairo",
    university: "Cairo University",
    rating: 4.5,
    description: "Famous for delicious koshary, a must-visit spot for students.",
    categoryId: 'a0641b11-f313-4d90-81fd-2523a70b1938'
  },
  {
    username: "gad_cairo",
    email: "gad@example.com",
    password: "Gad123!",
    phoneNumber: "01000000002",
    name: "Gad",
    location: "Nahdet Misr St, Cairo",
    university: "Cairo University",
    rating: 4.3,
    description: "Popular for Egyptian street food, serving falafel and shawarma.",
    categoryId: 'e932ea53-bca5-4ff1-bef0-cb643d32f8a6'
  },
  {
    username: "arabiata_ful",
    email: "arabiata@example.com",
    password: "Arabiata123!",
    phoneNumber: "01000000003",
    name: "Arabiata",
    location: "Gamaet El Dowal St, Cairo",
    university: "Cairo University",
    rating: 4.4,
    description: "One of the best places for ful and falafel sandwiches.",
    categoryId: 'e932ea53-bca5-4ff1-bef0-cb643d32f8a6'
  },
  {
    username: "macdonalds_giza",
    email: "macdonalds@example.com",
    password: "Mac123!",
    phoneNumber: "01000000005",
    name: "McDonald's",
    location: "Giza Square, Cairo",
    university: "Cairo University",
    rating: 4.1,
    description: "Global fast-food chain offering burgers, fries, and meals.",
    categoryId: "cc5c027d-0042-4f58-bab6-b98c973320d0"
  },
  {
    username: "kfc_cairouni",
    email: "kfc@example.com",
    password: "KFC123!",
    phoneNumber: "01000000006",
    name: "KFC",
    location: "Gamaet El Dowal St, Cairo",
    university: "Cairo University",
    rating: 4.0,
    description: "Popular for fried chicken, sandwiches, and fast food.",
    categoryId: "cc5c027d-0042-4f58-bab6-b98c973320d0"
  },
  {
    username: "pizza_hut_giza",
    email: "pizzahut@example.com",
    password: "PizzaHut123!",
    phoneNumber: "01000000009",
    name: "Pizza Hut",
    location: "Giza Square, Cairo",
    university: "Cairo University",
    rating: 4.1,
    description: "Famous for delicious pizza, pasta, and sides.",
    categoryId: "5d8043a1-549a-4272-a78a-dcdf1588b4b7"
  },
  {
    username: "dominos_cairouni",
    email: "dominos@example.com",
    password: "Dominos123!",
    phoneNumber: "01000000010",
    name: "Domino's Pizza",
    location: "Dokki, Cairo",
    university: "Cairo University",
    rating: 4.2,
    description: "Great pizza with various toppings and fast delivery.",
    categoryId: "5d8043a1-549a-4272-a78a-dcdf1588b4b7"
  },
  {
    username: "abou_shakra_giza",
    email: "aboushakra@example.com",
    password: "Abou123!",
    phoneNumber: "01000000011",
    name: "Abou Shakra",
    location: "Mohandessin, Cairo",
    university: "Cairo University",
    rating: 4.5,
    description: "Top choice for grilled meats and Egyptian cuisine.",
    categoryId: "becbd30e-b992-46e7-9b7f-5e7891d68193"
  },
  {
    username: "tbs_giza",
    email: "tbs@example.com",
    password: "TBS123!",
    phoneNumber: "01000000012",
    name: "The Bakery Shop (TBS)",
    location: "Dokki, Cairo",
    university: "Cairo University",
    rating: 4.6,
    description: "Freshly baked pastries, bread, and delicious breakfast.",
    categoryId: "cf4da042-614d-4fe4-9dae-94ef2ac7e883"
  },
  {
    username: "felfela_giza",
    email: "felfela@example.com",
    password: "Felfela123!",
    phoneNumber: "01000000015",
    name: "Felfela",
    location: "Mohandessin, Cairo",
    university: "Cairo University",
    rating: 4.4,
    description: "Authentic Egyptian food with a great ambiance.",
    categoryId: "e932ea53-bca5-4ff1-bef0-cb643d32f8a6"
  }
];


const registerMutliRestaurants = asyncHandler(async (req, res) => {
  try {
    for (const restaurant of restaurantData) {
      const { username, email, password, phoneNumber, name, location, university, rating, description, categoryId } = restaurant;
      const role = "restaurant";

      //console.log("categoryId: ", categoryId)
      const { createdUser, accessToken, options } = await registerUser(username, email, password, phoneNumber, role);

      if (!createdUser) {
        console.error(`Failed to register user: ${username}`);
        continue;
      }

      const restaurantId = createdUser.userId;

      const newRestaurant = await RestaurantModel.createRestaurant(restaurantId, name, categoryId, location, university, rating, description);

      if (!newRestaurant) {
        console.error(`Failed to create restaurant: ${name}`);
        continue;
      }

      console.log(`Successfully registered restaurant: ${name}`);
    }

    res.status(200).json(new ApiResponse(200, { message: "All restaurants registered successfully" }));
  } catch (error) {
    console.error("Error registering restaurants:", error);
    res.status(500).json(new ApiError(500, "Failed to register restaurants"));
  }
});


const registerRestaurant = asyncHandler(async (req, res) => {
    const { username, email, password, phoneNumber, name, location, university, rating, description } = req.body;
  
    const role = "restaurant";
    // Register the user first
    
    const {createdUser, accessToken, options} = await registerUser(username, email, password, phoneNumber, role);


    //console.log("Created user", createdUser);
        
    const restaurantId = createdUser.userId;
    //console.log(username, email, password, phoneNumber, name, location, university, rating, description);


    // Create restaurant entry
    const restaurant = await RestaurantModel.createRestaurant(restaurantId, name, "09f02d8c-ccc9-4893-bb77-e4d0d1336489", location, university, rating, description);
  
    if (!restaurant) {
      throw new ApiError(500, "Failed to create restaurant. Please try again.");
    }
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken },
        "Restaurant registered successfully"
      )
    ); // excluded pass field and return user with access token  });
});

/*
const registerRestaurant = asyncHandler(async (req, res) => {
    const { username, email, password, phoneNumber, name, categoryId, location, university, rating, description } = req.body;
    
    if (!name || !categoryId || !location || !university || !rating || !description) {
    throw new ApiError(400, "Please provide all required fields");
    }

    // check if user is already registered
    const existingUser = await UserModel.getUserByEmail(email);

    // throw an error if use exists
    if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
    }

    const role = "restaurant";
    // Register the user first
    // if not user existes create new user
    const createdUser = await UserModel.createUser(username, email, password, phoneNumber, role);

    console.log("Created user", createdUser);

    if (!createdUser) {
    throw new ApiError(500, "something went wrong registering  user");
    }

    // if user is authenticated, create jwt token
    const {accessToken} = await UserModel.generateAccessToken(createdUser);

    // add more options to make cookie more secure and reliable
    const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 86400000),
    };
    
    
    const restaurantId = createdUser.userId
    console.log(username, email, password, phoneNumber, name, categoryId, location, university, rating, description);
  
    // Create restaurant entry
    const restaurant = await RestaurantModel.createRestaurant(restaurantId, name, categoryId, location, university, rating, description);
  
    if (!restaurant) {
      throw new ApiError(500, "Failed to create restaurant. Please try again.");
    }
  
    // Fetch and return updated restaurant details
    const registeredRestaurant = await RestaurantModel.getRestaurantById(restaurantId);
   

    return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken },
        "Restaurant logged in successfully"
      )
    ); // excluded pass field and return user with access token
});
  */
  
  

const getRestaurantItems = asyncHandler(async (req, res) => {

  const {restaurantId} = req.body;

  // get all restaurants from db
  const items = ProductModel.getProductsByRestaurantId(restaurantId);

  if (!items) {
    throw new ApiError(404, "Items not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { items: items },
        "items fetched successfully"
      )
    );
});

  const getAllRestaurants = asyncHandler(async (req, res) => {
    // get all restaurants from db
    const restaurants = await RestaurantModel.getAllRestaurants();
  
    if (!restaurants) {
      throw new ApiError(404, "restaurant not found");
    }
  
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

  const getRestaurantsByCategoryId  = asyncHandler(async (req, res) => {
    const {categoryId} = req.body;


    // get all restaurants from db
    const restaurants = await RestaurantModel.getRestaurantsByCategory(categoryId);
  
    if (!restaurants) {
      throw new ApiError(404, "restaurant not found");
    }
  
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



export {
  createCategory,
  updateProduct,
  deleteProduct,
  createProduct,
  registerRestaurant,
  getAllRestaurants,
  getRestaurantsByCategoryId,
  getRestaurantItems,
  registerMutliRestaurants,
};

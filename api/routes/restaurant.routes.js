import {
    createCategory,
    createProduct,
    deleteProduct,
    updateProduct,
    registerRestaurant,
    getAllRestaurants,
    getRestaurantsByCategoryId,
    getRestaurantItems,
    registerMutliRestaurants,
  } from "../controllers/restaurant.controller.js";
  import { updateOrderStatus, getAllOrders } from "../controllers/order.controller.js";
  import { verifyJwt } from "../middlewares/jwt.authMiddleware.js";
  import { productValidator } from "../validators/product.validators.js";
  import { validate } from "../validators/validate.js";
  import { Router } from "express";


  import {
      userLoginValidator,
    userRegisterValidator,
  } from "../validators/user.validators.js";
import { verifyRestaurant } from "../middlewares/restaurant.authMiddleware.js";

  
  const router = Router();
  
  // secured restaurant routes

  router.route("/registerMany").post(registerMutliRestaurants);
  

  router.route("/register").post(userRegisterValidator(), validate, registerRestaurant);
  router.route("/get-all-restaurants").get(verifyJwt, verifyRestaurant, getAllRestaurants);
  router.route("/getRestaurantsByCategory").get(verifyJwt, verifyRestaurant, getRestaurantsByCategoryId);
  router.route("/restaurant/:restaurantId").get(verifyJwt, verifyRestaurant, getRestaurantItems);
  router.route("/update-product/:productId").put(verifyJwt, verifyRestaurant, updateProduct);
  router.route("/getOrders").get(validate, verifyJwt, verifyRestaurant, getAllOrders);
  
  
  // product routes
  router
    .route("/create-category")
    .post(validate, verifyJwt, verifyRestaurant, createCategory);
  router
    .route("/create-product")
    .post(productValidator(), validate, verifyJwt, verifyRestaurant, createProduct);
  router
    .route("/update-product/:productId")
    .patch(validate, verifyJwt, verifyRestaurant, updateProduct);
  router
    .route("/delete-product/:productId")
    .delete(verifyJwt, verifyRestaurant, deleteProduct);
  router
    .route("/update-order-status")
    // .patch(validate, verifyJwt, verifyRestaurant, updateOrderStatus);
    .patch(updateOrderStatus);
  export default router;
  
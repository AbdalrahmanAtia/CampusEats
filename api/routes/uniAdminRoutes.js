import express from "express";
import { loginUser } from "../controllers/uniAdminController.js";
import { addMealPlan } from "../controllers/uniAdminController.js";

import {fetchMealPlans, updateMealPlan } from "../controllers/mealPlanController.js"; // Ensure this is correctly exported
import { authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => res.send("Uni Admin Routes Working!"));
router.post("/login", loginUser);
router.post("/mealplans", authMiddleware, addMealPlan);  // Ensure only authenticated admins can add
//router.post("/mealplans", addMealPlan);
router.get("/mealplans", fetchMealPlans); 
router.put("/mealplans/:id",  updateMealPlan);

export default router;

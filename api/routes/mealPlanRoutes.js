import express from "express";
import { fetchMealPlans } from "../controllers/mealPlanController.js";

const router = express.Router();

router.get("/mealplans", fetchMealPlans);

export default router;

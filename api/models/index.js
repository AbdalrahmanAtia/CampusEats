import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pool from "../config/db/index.js"; // Import DB connection
import MealPlanModel from "./mealPlan.js"; // Import the model

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB_DATABASE,
  process.env.MYSQL_DB_USER,
  process.env.MYSQL_DB_PASSWORD,
  {
    host: process.env.MYSQL_DB_HOST,
    dialect: "mysql",
  }
);

const MealPlan = MealPlanModel(sequelize); // ✅ Correct usage of the function

// Function to create a meal plan
async function createMealPlan(mealPlanData) {
  const { university_id, name, price, description, flex_points, weekly_meals, total_meals, total_price } = mealPlanData;

  const query = `
    INSERT INTO MealPlans (university_id, name, price, description, flex_points, weekly_meals, total_meals, total_price) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [university_id, name, price, description, flex_points, weekly_meals, total_meals, total_price];

  const [result] = await pool.execute(query, values);
  return result;
}

// Function to retrieve meal plans
async function getMealPlans() {
  const [rows] = await pool.execute("SELECT * FROM MealPlans");
  return rows;
}

// ✅ Export correctly
export { sequelize, MealPlan, createMealPlan, getMealPlans };

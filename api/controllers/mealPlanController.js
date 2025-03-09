//import { fetchMealPlans } from "../models/MealPlan.js"; // ✅ Ensure correct import



import connectDB from "../config/db/index.js";  // Import the default export

const fetchMealPlans = async (req, res) => {
  try {
    const db = await connectDB();  // Get a connection from the pool
    const [mealPlans] = await db.query("SELECT * FROM meal_plans"); // Use the connection
    db.release(); // Release the connection back to the pool

    res.json(mealPlans);
  } catch (error) {
    console.error("⚠️ Error fetching meal plans:", error);
    res.status(500).json({ message: "Server error while fetching meal plans" });
  }
};

export { fetchMealPlans };





const updateMealPlan = async (req, res) => {
  const mealPlanId = req.params.id;
  const { name, description } = req.body; // Extract values from request

  console.log(`Updating meal plan with ID: ${mealPlanId}`);

  try {
    const db = await connectDB(); // Get database connection
    const [result] = await db.query(
      "UPDATE meal_plans SET name = ?, description = ? WHERE id = ?",
      [name, description, mealPlanId]
    );

    db.release(); // Release connection back to the pool

    if (result.affectedRows > 0) {
      res.json({ message: "Meal plan updated successfully" });
    } else {
      res.status(404).json({ message: "Meal plan not found" });
    }
  } catch (error) {
    console.error("⚠️ Error updating meal plan:", error);
    res.status(500).json({ message: "Server error while updating meal plan" });
  }
};

export { updateMealPlan };


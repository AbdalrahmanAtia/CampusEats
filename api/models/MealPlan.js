import connectDB from "../config/db/index.js"; // ✅ Keep using connectDB

export const getMealPlans = async () => {
    let db;
    try {
        db = await connectDB(); // ✅ Get a connection from the pool
        const [rows] = await pool.query("SELECT name, weekly_meals, flex_points, description, total_meals, total_price FROM meal_plans");
        return rows;
    } catch (error) {
        console.error("⚠️ Error fetching meal plans:", error);
        throw error;
    } finally {
        if (db) db.release(); // ✅ Release the connection back to the pool
    }
};
export const updateMealPlan = async (id, updatedData) => {
  let db;
  try {
      db = await connectDB();
      const query = `UPDATE meal_plans SET name = ?, price = ?, description = ?, updated_at = NOW() WHERE id = ?`;
      const values = [updatedData.name, updatedData.price, updatedData.description, id];

      const [result] = await db.query(query, values);
      return result;
  } catch (error) {
      console.error("⚠️ Error updating meal plan:", error);
      throw error;
  } finally {
      if (db) db.release();
  }
};


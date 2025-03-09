
// ✅ UniAdmin login function (Modified to include university_id in response)

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db/index.js";

dotenv.config();

/**
 * ✅ UniAdmin Login Controller
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    let db = null;

    try {
        console.log("🔹 Login request received:", email);
        db = await connectDB();

        // ✅ Get user from database
        const [results] = await db.execute(
            "SELECT users.userId, uni_admins.university_id, users.password FROM users JOIN uni_admins ON users.userId = uni_admins.user_id WHERE users.email = ?",
            [email]
        );

        if (results.length === 0) {
            console.warn("❌ Invalid email:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];

        // ✅ Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn("❌ Password mismatch for:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: user.userId, role: "uniAdmin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("✅ Login successful for:", email);
        res.json({ token,    university_id: user.university_id  });

    } catch (err) {
        console.error("❌ Unexpected error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

/**
 * ✅ Fetch Meal Plans
 */
export const getMealPlans = async (req, res) => {
    let db = null;
    try {
        db = await connectDB();
        const connection = await db.getConnection();
        const [mealPlans] = await connection.execute("SELECT * FROM meal_plans");
        connection.release();
        res.json(mealPlans);
    } catch (err) {
        console.error("❌ Database error:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    } finally {
        if (db) db.end();
    }
};

/**
 * ✅ Add Meal Plan (Only for UniAdmins)
 */



export const addMealPlan = async (req, res) => {
    const { name, price, description, flex_points, weekly_meals, total_meals, total_price } = req.body;
    const userId = req.user?.id;
    let connection = null;

    try {
        console.log("🔹 Request Body:", req.body); // ✅ Log request body for debugging

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user data found." });
        }

        connection = await connectDB(); // ✅ Get a connection

        // ✅ Get university_id from uni_admins table using userId
        const [adminResults] = await connection.execute(
            "SELECT university_id FROM uni_admins WHERE user_id = ?", 
            [userId]
        );

        if (adminResults.length === 0) {
            return res.status(403).json({ error: "Access denied. Not a UniAdmin." });
        }

        const university_id = adminResults[0].university_id; // ✅ Extract university_id

        // ✅ Insert meal plan
        const [result] = await connection.execute(
            "INSERT INTO meal_plans (university_id, name, price, description, flex_points, weekly_meals, total_meals, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [university_id, name, price, description, flex_points, weekly_meals, total_meals, total_price]
        );

        res.status(201).json({
            id: result.insertId,
            university_id,
            name,
            price,
            description,
            flex_points,
            weekly_meals,
            total_meals,
            total_price
        });

    } catch (err) {
        console.error("🚨 Database error in addMealPlan:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    } finally {
        if (connection) connection.release(); // ✅ Release the connection properly
    }
};

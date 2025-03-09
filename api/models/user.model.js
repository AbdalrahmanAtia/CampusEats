import bcrypt from "bcrypt";
import connectDB from "../config/db/index.js";
import { generateUUID } from "../utils/uuid.js";
import jwt from "jsonwebtoken";

class UserModel {
  // generate access token using jsonwebtoken
  static generateAccessToken = async (user) => {
    const accessToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    return accessToken;
  };

  // generate refresh token
  static getRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.ACCESS_REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    return refreshToken;
  };

  static createUser = async (username, email, password, phoneNumber, role) => {
    const db = await connectDB();
    try {

      // console.log("username ---: ", username);
      // console.log("email -- : ", email);
      // console.log("password --: ", password);
      // console.log("phoneNumber --: ", phoneNumber);
      // console.log("role --: ", role);

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate a unique userId
      const userId = generateUUID();


      // console.log("userId: ", userId);
      // console.log("username: ", username);
      // console.log("email: ", email);
      // console.log("hashedPassword: ", hashedPassword);
      // console.log("phoneNumber: ", phoneNumber);
      // console.log("studentId: ", studentId);
      // console.log("university: ", university);
      // console.log("avatar: ", "noProfile.png");
      // console.log("createdAt: ", Date().toLocaleString());
      // console.log("updatedAt: ", Date().toLocaleString());
      
  
      // Save the user in the database
      const [result] = await db.execute(
        `INSERT INTO users (userId, avatar, username, email, password, role, createdAt, updatedAt, phoneNumber)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          role == "restaurant" ? "noRestaurant.png" : "noProfile.png",
          username,
          email,
          hashedPassword,
          role,
          new Date().toLocaleString(),
          new Date().toLocaleString(),
          phoneNumber
        ]
      );
  
      // If user creation is successful, return the user
      if (result.affectedRows > 0) {
        const user = await this.getUserById(userId);
        return user;
      }
      return null; // Return null if the user was not created
    } catch (error) {
      console.error("Error registering user: ", error.message);
      throw error;
    } finally {
      if (db) db.release(); // Ensure database connection is released
    }
  };

  // delete the user from the database
  static deleteUserById = async (userId) => {
    const db = await connectDB();
    try {
      const res = await db.execute("DELETE FROM Users WHERE userId = ?", [
        userId,
      ]);

      if (res[0].affectedRows > 0) {
        return true;
      }
    } catch (error) {
      console.log("error deleting user: ", error.message);
      return false;
    } finally {
      if (db) db.release(); // release the db connection pool
    }
  };

  // get user by userId
  static getUserById = async (userId) => {
    const db = await connectDB();
    try {
      const user = await db.query("SELECT * FROM Users WHERE userId = ?", [
        userId,
      ]);

      // const { password, ...rest } = user[0][0];
      return user[0][0];
    } catch (error) {
      console.error("Error getting user from db", error);
    } finally {
      if (db) db.release();
    }
  };

  // get user info for login
  // critical function
  static getUserForLogin = async (email) => {
    const db = await connectDB();
    try {
      const user = await db.query("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      return user[0][0]; // return user info with credentials for verification purposes
    } catch (error) {
      console.log("error getting user info : ", error);
    } finally {
      if (db) db.release();
    }
  };

  // get user by email
  static getUserByEmail = async (email) => {
    const db = await connectDB();
    try {
      const user = await db.query("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      if (!user) return null; // return null if user is not found with email
      // const { password, ...rest } = user[0][0];
      if (db) db.release();
      return user[0][0];
    } catch (error) {
      console.error("Error getting user from db", error);
    } finally {
      if (db) db.release();
    }
  };


  static updateUser = async (userId, updateFields = {}) => {
    const db = await connectDB();
    try {
      let sqlQuery = "UPDATE Users SET ";
      const sqlQueryData = [];

      Object.entries(updateFields).forEach(([key, value], index, array) => {
        sqlQuery += `${key} = ?, `;
        sqlQueryData.push(value);

        if (index === array.length - 1) {
          // sqlQuery = sqlQuery.slice(0, -2) + " WHERE userId = ?";
          sqlQuery = sqlQuery + " updatedAt=? WHERE userId = ?";
          sqlQueryData.push(new Date().toLocaleString());
          sqlQueryData.push(userId);
        }
      });
      // console.log(sqlQuery, sqlQueryData);

      const [result] = await db.execute(sqlQuery, sqlQueryData);

      // const updatedUser = await this.getUserById(userId);
      // console.log(updatedUser);
      // return updatedUser;

      if (result.affectedRows > 0) {
        const updatedUser = this.getUserById(userId);
        return updatedUser;
      }
    } catch (error) {
      console.error("Error updating user: ", error.message);
    } finally {
      if (db) db.release();
    }
  };

  static getAllUsers = async () => {
    const db = await connectDB();

    try {
      const users = await db.query(
        "SELECT userId, avatar,username ,email ,role , createdAt, updatedAt FROM Users"
      );
      if (!users) return null;

      if (db) db.release();
      return users[0];
    } catch (error) {
      console.log("Error getting user from db", error);
    } finally {
      if (db) db.release();
    }
  };


  // Fetch Data from Database
static fetchData = async (userId, userUniversity) => {
  const db = await connectDB();


  console.log("UserId:", userId);
  console.log("UserUniversity:", userUniversity);
  
  try {
    // Example Queries to fetch data
    const userPreferencesQuery = `
      SELECT p.productId, p.productName, p.vegetarian, p.rating, c.categoryName
      FROM orders o
      JOIN orderitems oi ON o.orderId = oi.orderId
      JOIN products p ON oi.productId = p.productId
      JOIN categories c ON p.categoryId = c.categoryId
      WHERE o.userId = ?
    `;
    //ORDER BY o.createdAt DESC LIMIT 10;

    const restaurantPopularityQuery = `
      SELECT r.restaurantId, r.name, COUNT(o.orderId) AS popularity
      FROM orders o
      JOIN restaurants r ON o.restaurantId = r.restaurantId
      GROUP BY r.restaurantId
      ORDER BY popularity DESC
      LIMIT 5;
    `;

    const restaurantRatingsQuery = `
      SELECT r.restaurantId, r.name, r.rating
      FROM restaurants r
      WHERE r.rating >= 4.5
      ORDER BY r.rating DESC
      LIMIT 5;
    `;

    const locationBasedQuery = `
      SELECT r.name, r.university
      FROM restaurants r
      WHERE r.university LIKE ?
      ORDER BY r.name;
    `;

    const trendyRestaurantsQuery = `
      SELECT r.name, COUNT(o.orderId) AS orderCount
      FROM orders o
      JOIN restaurants r ON o.restaurantId = r.restaurantId
      GROUP BY r.restaurantId
      ORDER BY orderCount DESC
      LIMIT 5;
    `;

    //WHERE o.createdAt BETWEEN NOW() - INTERVAL 30 DAY AND NOW()


    // Fetch Data from Database
    const [userPreferences] = await db.query(userPreferencesQuery, [userId]);

    //console.log("Raw userPreferences:", userPreferences);  // Check what raw data we receive

    if (!userPreferences || userPreferences.length === 0) {
      throw new Error("No user preferences found for the given userId.");
    }
    
    const [popularRestaurants] = await db.query(restaurantPopularityQuery);
    const [topRatedRestaurants] = await db.query(restaurantRatingsQuery);
    const [locationBasedRestaurants] = await db.query(locationBasedQuery, [userUniversity]);
    const [trendyRestaurants] = await db.query(trendyRestaurantsQuery);

    // Print all the results safely
    // console.log("User Preferences:", JSON.stringify(userPreferences));
    // console.log("\n\n");
    // console.log("Popular Restaurants:", JSON.stringify(popularRestaurants));
    // console.log("\n\n");
    // console.log("Top Rated Restaurants:", JSON.stringify(topRatedRestaurants));
    // console.log("\n\n");

    // console.log("Location-Based Restaurants:", JSON.stringify(locationBasedRestaurants));
    // console.log("\n\n");

    // console.log("Trendy Restaurants:", JSON.stringify(trendyRestaurants));
    // console.log("\n\n");

    return {
      userPreferences,
      popularRestaurants,
      topRatedRestaurants,
      locationBasedRestaurants,
      trendyRestaurants,
    };

  } catch (error) {
    console.error("Error fetching user data: ", error.message);
  } finally {
    if (db) db.release();
  }

  };
  
}

export { UserModel };
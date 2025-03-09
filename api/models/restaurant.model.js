import connectDB from "../config/db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { generateUUID } from "../utils/uuid.js";
import { categoriesModel } from "./categories.model.js";
import { UserModel } from "./user.model.js";

class RestaurantModel {

  static createRestaurant = async (restaurantId, name, categoryId, location, university, rating, description) => {

    const db = await connectDB();
    try {

      const [result] = await db.execute(
        "INSERT INTO Restaurants (restaurantId, name, categoryId, rating, description, university, location) VALUES (?, ?, ?, ?, ?, ?, ?) ",
        [
          restaurantId,
          name,
          categoryId || null,
          rating,
          description,
          university,
          location,
        ]
      );

      if (result.affectedRows > 0) {
        return await this.getRestaurantById(restaurantId);
      }
    } catch (error) {
      console.log("Error while creating restaurant", error);
      throw new ApiError(500, error.message);
    } finally {
      if (db) db.release();
    }
  };

  static updateRestaurant = async (restaurantId, updateFields = {}) => {
    const db = await connectDB();
    try {
      let sqlQuery = "UPDATE Restaurants SET ";
      const sqlQueryData = [];

      Object.entries(updateFields).forEach(([key, value], index, array) => {
        sqlQuery += `${key} = ?, `;
        sqlQueryData.push(value);
        
        if (index === array.length - 1) {
          sqlQuery += " updatedAt = ? WHERE restaurantId = ?";
          sqlQueryData.push(new Date().toLocaleString(), restaurantId);
        }
      });

      const [updateRes] = await db.execute(sqlQuery, sqlQueryData);
      if (!updateRes.affectedRows) {
        throw new ApiError(404, "Restaurant not found");
      }

      return await this.getRestaurantById(restaurantId);
    } catch (error) {
      console.log("Error updating the restaurant", error);
      throw new ApiError(500, error.message);
    } finally {
      if (db) db.release();
    }
  };

  static getRestaurantById = async (restaurantId) => {
    const db = await connectDB();
    try {
      const [restaurant] = await db.execute(
        `SELECT r.restaurantId, u.avatar, u.username, u.email, u.phoneNumber, u.role, 
                        r.name, r.university, r.location, r.description, r.rating
                 FROM users u 
                 JOIN restaurants r
                 ON u.userId = r.restaurantId 
                 WHERE r.restaurantId = ?`,
        [restaurantId]
      );
      return restaurant[0];
    } catch (error) {
      console.log("Error getting restaurant", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };

  static getRestaurantsByName = async (name) => {
    const db = await connectDB();
    try {
      const [restaurants] = await db.execute(
        `SELECT r.restaurantId, u.avatar, u.username, u.email, u.phoneNumber, u.role, 
                        r.name, r.university, r.location, r.description, r.rating
                 FROM users u 
                 JOIN restaurants r
                 ON u.userId = r.restaurantId 
                WHERE r.name REGEXP ? ORDER BY r.name`,
        [name]
      );
      return restaurants;
    } catch (error) {
      console.log("Error getting restaurants", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };


  static getRestaurantsByCategory = async (categoryId) => {
    const db = await connectDB();
    try {
      const [restaurants] = await db.execute(
        `SELECT r.restaurantId, u.avatar, u.username, u.email, u.phoneNumber, u.role, 
                        r.name, r.university, r.location, r.description, r.rating
                 FROM users u 
                 JOIN restaurants r
                 ON u.userId = r.restaurantId 
                 WHERE r.categoryId REGEXP ? ORDER BY r.name`,
        [categoryId]
      );
      return restaurants;
    } catch (error) {
      console.log("Error getting restaurants", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };


  static getRestaurantsByUniversity = async (university) => {
    const db = await connectDB();
    try {
      const [restaurants] = await db.execute(
       `SELECT r.restaurantId, u.avatar, u.username, u.email, u.phoneNumber, u.role, 
                        r.name, r.university, r.location, r.description, r.rating
                 FROM users u 
                 JOIN restaurants r 
                 ON u.userId = r.restaurantId 
                 WHERE r.university REGEXP ? ORDER BY r.university`,
        [university]
      );
      return restaurants;
    } catch (error) {
      console.log("Error getting restaurants", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };

  static getAllRestaurants = async () => {
    const db = await connectDB();
    try {
      const [restaurants] = await db.execute(       
        `SELECT r.restaurantId, u.avatar, u.username, u.email, u.phoneNumber, u.role, 
        r.name, r.university, r.location, r.description, r.rating
        FROM users u 
        JOIN restaurants r
        ON u.userId = r.restaurantId`);
      return restaurants;
    } catch (error) {
      console.log("Error getting all restaurants", error);
      throw new ApiError(500, error.message);
    } finally {
      if (db) db.release();
    }
  };

  static deleteRestaurantById = async (restaurantId) => {
    const db = await connectDB();
    try {
      const [delRes] = await db.execute(
        "DELETE FROM Restaurants WHERE restaurantId = ?",
        [restaurantId]
      );
      return delRes.affectedRows > 0;
    } catch (error) {
      console.log("Error deleting restaurant", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };
}

export { RestaurantModel };

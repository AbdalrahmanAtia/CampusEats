import connectDB from "../config/db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { generateUUID } from "../utils/uuid.js";

class ProductModel {
  static createProduct = async (product = {}) => {
    const db = await connectDB();
    try {
      // generate a unique id for each product
      const productId = generateUUID();

      const [result] = await db.execute(
        "INSERT INTO Products (productId, productName, image, rating, description, vegetarian, price, categoryId, createdAt, updatedAt, restaurantId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ",
        [
          productId,
          product.productName,
          product.image,
          product.rating,
          product.description,
          product.vegetarian,
          product.price,
          product.categoryId || null, // This is the corrected part
          new Date().toLocaleString(),
          new Date().toLocaleString(),
          product.restaurantId,
        ]
      );

      if (result.affectedRows > 0) {
        const product = await this.getProductById(productId);
        return product; // return the created product
      }
    } catch (error) {
      console.log("error while creating product", error);
      throw new ApiError(500, error.message);
    } finally {
      if (db) db.release();
    }
  };

// update products
static updateProducts = async (productId, updateFields = {}) => {
  const db = await connectDB();

  try {
    // Ensure there are fields to update
    if (Object.keys(updateFields).length === 0) {
      throw new ApiError(400, "No fields provided for update");
    }

    // Initialize SQL query and query data array
    let sqlQuery = "UPDATE Products SET ";
    const sqlQueryData = [];

    Object.entries(updateFields).forEach(([key, value], index) => {
      sqlQuery += `${key} = ?`;
      sqlQueryData.push(value);

      if (index < Object.entries(updateFields).length - 1) {
        sqlQuery += ", "; // Add comma for multiple fields
      }
    });

    // Append updatedAt and WHERE clause
    sqlQuery += ", updatedAt = ? WHERE productId = ?";
    sqlQueryData.push(new Date().toISOString()); // Use ISO format for timestamps
    sqlQueryData.push(productId);

    // Execute update query
    const [updateRes] = await db.execute(sqlQuery, sqlQueryData);
    
    if (updateRes.affectedRows === 0) {
      throw new ApiError(404, "Product not found");
    }

    // Fetch updated product
    const updatedProduct = await this.getProductById(productId);
    return updatedProduct;
  } catch (error) {
    console.error("Error updating the product:", error);
    throw new ApiError(500, error.message || "Internal Server Error");
  } finally {
    if (db) db.end(); // Close the database connection
  }
};


  // Get the product from product Id
  static getProductById = async (productId) => {
    const db = await connectDB();
    try {
      const product = await db.execute(
        "SELECT * FROM Products WHERE productId = ? ",
        [productId]
      );

      if (db) db.release(); // close  db connection

      return product[0][0];
    } catch (error) {
      console.log("Error getting product from db", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };

  // Get the product by name
  static getProductsByName = async (productName) => {
    const db = await connectDB();
    try {
      const product = await db.execute(
        "SELECT * FROM Products WHERE ProductName REGEXP ? ORDER BY ProductName ",
        [productName]
      );

      return product[0];
    } catch (error) {
      console.log("Error getting product from db", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };

  // Get all products
  static getAllProducts = async () => {
    const db = await connectDB();
    try {
      const products = await db.execute("SELECT * FROM Products");

      return products[0];
    } catch (error) {
      console.log("Error getting products", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };

  // Get products by category
  static getProductsByCategoryName = async (categoryName) => {
    const db = await connectDB();

    try {
      const products = await db.execute(
        "SELECT * FROM Products P JOIN Categories C ON P.categoryId = C.categoryId WHERE C.categoryName REGEXP ?",
        [categoryName]
      );

      return products[0];
    } catch (error) {
      console.log("error getting categorized products", error);
      return error;
    } finally {
      if (db) db.release();
    }
  };

  // get products by category ID
  static getProductsByCategoryId = async (categoryId) => {
    const db = await connectDB();
    try {
      const products = await db.query(
        "SELECT * FROM Products WHERE categoryId = ?",
        [categoryId]
      );

      return products[0];
    } catch (error) {
      console.log("error while fetching products by categoryId", error);
      return error;
    } finally {
      if (db) db.release();
    }
  };

    // get products by category ID
    static getProductsByRestaurantId = async (restaurantId) => {
      const db = await connectDB();
      try {
        const products = await db.query(
          "SELECT * FROM Products WHERE restaurantId = ?",
          [restaurantId]
        );
  
        return products[0];
      } catch (error) {
        console.log("error while fetching products by categoryId", error);
        return error;
      } finally {
        if (db) db.release();
      }
    };

  // delete products
  static deleteProductById = async (productId) => {
    const db = await connectDB();
    try {
      const [delProdRes] = await db.execute(
        "DELETE FROM Products WHERE productId = ?",
        [productId]
      );

      // return true if product not deleted
      if (delProdRes.affectedRows > 0) {
        return true;
      }

      // return false if product not deleted
      return false;
    } catch (error) {
      console.log("error deleting product", error);
      throw new ApiError(404, error.message);
    } finally {
      if (db) db.release();
    }
  };
}

export { ProductModel };

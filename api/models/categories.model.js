import connectDB from "../config/db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { generateUUID } from "../utils/uuid.js";

class categoriesModel {
  // get categories by Id
  // static getCategoryById = async (categoryId) => {
  //   const db = await connectDB();
  //   try {
  //     // fetch categories by categoryId
  //     const result = db.execute(
  //       "SELECT * FROM Categories WHERE categoryId = ?",
  //       [categoryId]
  //     );

  //     return result[0][0];
  //   } catch (error) {
  //     console.log("error getting category by id ", error.message);
  //   } finally {
  //     if (db) db.release();
  //   }
  // };

  // create category
  static createCategory = async (categoryName, categoryDescription, categoryImage, restaurantId) => {
    const db = await connectDB();
    try {
      // generate a unique uuid for  the category;
      const categoryId = generateUUID();

      // create category
      const [result] = await db.execute(
        "INSERT INTO categories (categoryId, categoryName, description, categoryImage, createdAt, updatedAt, restaurantId) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          categoryId,
          categoryName,
          categoryDescription,
          categoryImage,
          new Date().toLocaleString(),
          new Date().toLocaleString(),
          restaurantId,
        ]
      );

      if (!result.affectedRows > 0) {
        return false;
      }
      return true;
    } catch (error) {
      console.log("error creating category", error);
      return false;
    } finally {
      if (db) db.release();
    }
  };

  // get all categories
  static getAllCategories = async () => {
    const db = await connectDB();
    try {
      const categories = await db.execute("SELECT * FROM categories");

      //console.log("categories: \n" + categories)
      return categories[0];
    } catch (error) {
      console.log("error getting categories", error);
    } finally {
      if (db) db.release();
    }
  };

  static getCategoryById = async (categoryId) => {
    const db = await connectDB();
    try {
      const category = await db.execute(
        "SELECT * FROM categories WHERE categoryId = ?",
        [categoryId]
      );

      return category[0];
    } catch (error) {
      console.log("error getting category by id ", error);
    } finally {
      if (db) db.release();
    }
  };

  static getCategoryByName = async (categoryName) => {
    const db = await connectDB();
    try {
      const category = await db.execute(
        "SELECT * FROM categories WHERE categoryName REGEXP ?",
        [categoryName]
      );

      return category[0];
    } catch (error) {
      console.log("error getting category by name", error);
    } finally {
      if (db) db.release();
    }
  };

  static getCategoriesByRestaurantId = async (restaurantId) => {
    const db = await connectDB();
    try {
      const category = await db.execute(
        "SELECT * FROM categories WHERE restaurantId = ?",
        [restaurantId]
      );

      return category[0];
    } catch (error) {
      console.log("error getting category by this restaurant ID", error);
    } finally {
      if (db) db.release();
    }
  };

  static getMainCategories = async () => {
    const db = await connectDB();
    try {
      const mainCategories = await db.execute("SELECT * FROM maincategories");

      return mainCategories[0];
    } catch (error) {
      console.log("error getting main categories", error);
    } finally {
      if (db) db.release();
    }
  };


  static getMainCategoriesById = async (id) => {
    const db = await connectDB();
    try {
      const mainCategories = await db.execute("SELECT * FROM maincategories WHERE categoryId = ?", id);

      return mainCategories[0];
    } catch (error) {
      console.log("error getting main categories", error);
    } finally {
      if (db) db.release();
    }
  };
}

export { categoriesModel };

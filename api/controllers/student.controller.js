import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { filterObject } from "../utils/helper.js";
import { ProductModel } from "../models/product.model.js";
import { RestaurantModel } from "../models/restaurant.model.js";
import { categoriesModel } from "../models/categories.model.js";
import { imagesUpload, profileUpload } from "../utils/multerSetup.js";
import { StudentModel } from "../models/student.model.js";
import { registerUser } from "./user.controllers.js";


const registerStudent = asyncHandler(async (req, res) => {
    const { username, email, password, phoneNumber, studentId, university } = req.body;
  
    if (!studentId || !university) {
      throw new ApiError(400, "Please provide all required fields");
    }
  
    // Check if student ID is already registered
    const existingUser = await StudentModel.getStudentByStudentId(studentId);
  
    // Throw an error if student exists
    if (existingUser) {
      throw new ApiError(409, "Student with this student ID already exists");
    }

    const role = "student";
  
    // Register the user first
    const {createdUser, accessToken, options} = await registerUser( username, email, password, phoneNumber, role );

    const userId = createdUser.userId;
    // Create student entry
    const student = await StudentModel.createStudent(userId, studentId, university);
  
    if (!student) {
      throw new ApiError(500, "Failed to create student. Please try again.");
    }
      
    return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken},
        "Student registered successfully"
      )
    ); // excluded pass field and return user with access token
  });
  
  
  const getAllStudents = asyncHandler(async (req, res) => {
    // get all students from db
    const students = await StudentModel.getAllStudents();
  
    if (!students) {
      throw new ApiError(404, "user not found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, { students: students }, "students fetched successfully"));
  });


export {
  getAllStudents,
  registerStudent,
};

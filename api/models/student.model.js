import bcrypt from "bcrypt";
import connectDB from "../config/db/index.js";
import { generateUUID } from "../utils/uuid.js";
import jwt from "jsonwebtoken";
import { UserModel } from "./user.model.js";

class StudentModel {


  static createStudent = async (userId, studentId, university) => {

    const db = await connectDB();

    try {
      
      // Save the student in the database
      const [result] = await db.execute(
        `INSERT INTO students (userId, studentId, university)
         VALUES (?, ?, ?)`,
        [
          userId,
          studentId,
          university,
        ]
      );
  
      // If student creation is successful, return the student
      if (result.affectedRows > 0) {
        const student = await this.getStudentByStudentId(studentId);
        return student;
      }
      return null; // Return null if the student was not created
    } catch (error) {
      console.error("Error registering student: ", error.message);
      throw error;
    } finally {
      if (db) db.release(); // Ensure database connection is released
    }
  };


  // get student by StudentId
  static getStudentByStudentId = async (studentId) => {
    const db = await connectDB();
    try {
      const student = await db.query(`SELECT u.username, u.email, u.phoneNumber, u.role, 
                        s.studentId, s.university
                 FROM users u 
                 JOIN students s 
                 ON u.userId = s.userId 
                 WHERE s.studentId = ?`, 
                 [
        studentId,
      ]);
      if (!student) return null; // return null if student is not found with studentId
      // const { password, ...rest } = student[0][0];
      if (db) db.release();

      return student[0][0];
    } catch (error) {
      console.error("Error getting student from db", error);
    } finally {
      if (db) db.release();
    }
  };


  // get student by StudentId
  static getStudentByUserId = async (userId) => {
    const db = await connectDB();
    try {
      const student = await db.query(`SELECT u.username, u.email, u.phoneNumber, u.role, 
                        s.studentId, s.university
                  FROM users u 
                  JOIN students s 
                  ON u.userId = s.userId 
                  WHERE u.userId = ?`, 
                  [
        userId,
      ]);
      if (!student) return null; // return null if student is not found with studentId
      // const { password, ...rest } = student[0][0];
      if (db) db.release();

      return student[0][0];
    } catch (error) {
      console.error("Error getting student from db", error);
    } finally {
      if (db) db.release();
    }
  };



  static getStudentByUniversity = async (university) => {
    const db = await connectDB();
    try {
      const student = await db.query(`SELECT u.username, u.email, u.phoneNumber, u.role, 
                        s.studentId, s.university
                 FROM users u 
                 JOIN students s
                 ON u.userId = s.userId 
                 WHERE s.university = ?`, [
        university,
      ]);
      if (!student) return null; // return null if user is not found with university
      // const { password, ...rest } = student[0][0];
      if (db) db.release();

      return student[0][0];
    } catch (error) {
      console.error("Error getting student from db", error);
    } finally {
      if (db) db.release();
    }
  };


  static getAllStudents = async () => {
    const db = await connectDB();

    try {
      const students = await db.query(
       `SELECT u.username, u.email, u.phoneNumber, u.role, 
                        s.studentId, s.university
                 FROM users u 
                 JOIN students s
                 ON u.userId = s.userId`
      );
      if (!students) return null;

      if (db) db.release();
      return students[0];
    } catch (error) {
      console.log("Error getting student from db", error);
    } finally {
      if (db) db.release();
    }
  };
}

export { StudentModel };
import connectDB from "../config/db/index.js";

// Get all pending requests
export const getPendingRequests = async (university_id) => {
  try {
    const db = await connectDB(); // Get a fresh connection
    const [rows] = await db.query(
      "SELECT * FROM requests WHERE university_id = ? AND request_status = 'pending'",
      [university_id]
    );
    db.release(); // Release connection
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};



// Approve a request (set status to "approved")
export const approveRequest = async (request_id) => {
  try {
    const db = await connectDB();
    const [result] = await db.query(
      "UPDATE requests SET request_status = 'approved' WHERE request_id = ?",
      [request_id]  // ✅ Use 'request_id' instead of 'id'
    );
    db.release();
    return result;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

// Reject a request (set status to "rejected")
export const rejectRequest = async (request_id) => {
  try {
    const db = await connectDB();
    const [result] = await db.query(
      "UPDATE requests SET request_status = 'rejected' WHERE request_id = ?",
      [request_id]  // ✅ Use 'request_id' instead of 'id'
    );
    db.release();
    return result;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

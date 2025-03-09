import express from "express";
import { 
  handleGetPendingRequests, 
  handleApproveRequest, 
  handleRejectRequest 
} from "../controllers/RequestController.js"; // Import new controllers

const router = express.Router();

// Get all pending requests (using query parameters)
router.get("/", handleGetPendingRequests);

// Approve a request
router.post("/approve", handleApproveRequest);

// Reject a request
router.post("/reject", handleRejectRequest);

export default router;

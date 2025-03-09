import { getPendingRequests, approveRequest, rejectRequest } from "../models/Request.js"; // Import updated functions

// Get all pending requests
export const handleGetPendingRequests = async (req, res) => {
  try {
    const { university_id } = req.query;  

    if (!university_id) {
      return res.status(400).json({ message: "University ID is required" });
    }

    const requests = await getPendingRequests(university_id);

    if (requests.length === 0) {
      return res.status(200).json([]); // Return empty array if no pending requests
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Approve a request
export const handleApproveRequest = async (req, res) => {
  try {
    const { request_id } = req.body;
    if (!request_id) {
      return res.status(400).json({ message: "Request ID is required" });
    }
    
    console.log("Approving request with ID:", request_id);
    await approveRequest(request_id);
    
    res.status(200).json({ message: "Request approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Reject a request
export const handleRejectRequest = async (req, res) => {
  try {
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    await rejectRequest(request_id);
    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

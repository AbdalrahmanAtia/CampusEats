// authMiddleware.js
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

// Middleware to verify token and attach user to request object
export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.user = await UserModel.getUserById(decoded.userId);

    if (!req.user) {
      return next(new ApiError(404, "User not found."));
    }

    next(); // Proceed to next middleware or route handler
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token."));
  }
};

// Middleware to allow only 'uni-admin' role
export const isUniAdmin = (req, res, next) => {
  if (req.user.role !== "uniadmin") {
    return next(new ApiError(403, "Access denied. Uni Admins only."));
  }
  next();
};

// Middleware to allow only 'admin' role
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Access denied. Admins only."));
  }
  next();
};

// Middleware to allow both 'admin' and 'uni-admin' roles
export const isAnyAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "uniadmin") {
    return next(new ApiError(403, "Access denied. Admins only."));
  }
  next();
};

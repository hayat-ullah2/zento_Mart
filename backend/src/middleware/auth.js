import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";

// Extracts JWT from Authorization header OR cookie, attaches admin to req
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.[process.env.COOKIE_NAME || "zentomart_token"]) {
    token = req.cookies[process.env.COOKIE_NAME || "zentomart_token"];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error("Not authorized — token invalid or expired");
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    res.status(401);
    throw new Error("Not authorized — admin no longer exists");
  }

  req.admin = admin;
  next();
});

// Restricts to specific roles. Use AFTER protect.
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      res.status(401);
      throw new Error("Not authorized");
    }
    if (!roles.includes(req.admin.role)) {
      res.status(403);
      throw new Error(
        `Role "${req.admin.role}" is not allowed to access this resource`
      );
    }
    next();
  };
};

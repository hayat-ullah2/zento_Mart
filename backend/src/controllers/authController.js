import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Admin from "../models/Admin.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    // Cross-site cookies (frontend on a different domain than the API) require
    // SameSite=None + Secure. In dev we keep Lax so localhost works without HTTPS.
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join("; "));
  }

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signToken(admin._id);
  res.cookie(process.env.COOKIE_NAME || "zentomart_token", token, cookieOptions());

  res.json({
    success: true,
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      lastLoginAt: admin.lastLoginAt,
    },
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // Must pass the same secure/sameSite options used when setting the cookie,
  // otherwise the browser won't match it for deletion.
  res.clearCookie(process.env.COOKIE_NAME || "zentomart_token", cookieOptions());
  res.json({ success: true, message: "Logged out" });
});

// GET /api/auth/me  (protected)
export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      avatar: req.admin.avatar,
      lastLoginAt: req.admin.lastLoginAt,
    },
  });
});

// POST /api/auth/register
// First admin in an empty database can register publicly (bootstrap).
// After that, only an authenticated Owner can create more admins.
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join("; "));
  }

  const { name, email, password, role = "Manager", avatar } = req.body;

  const adminCount = await Admin.countDocuments();

  if (adminCount > 0) {
    // After the first admin exists, this endpoint requires Owner auth.
    // Re-run JWT verification inline so we can return a useful error.
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.[process.env.COOKIE_NAME || "zentomart_token"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : cookieToken;
    if (!token) {
      res.status(401);
      throw new Error("Admin already exists — Owner authentication required to create new admins");
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      res.status(401);
      throw new Error("Token invalid or expired");
    }
    const requester = await Admin.findById(decoded.id);
    if (!requester || requester.role !== "Owner") {
      res.status(403);
      throw new Error("Only Owner accounts can register new admins");
    }
  }

  // Force the bootstrap admin to be Owner; otherwise honor requested role
  const finalRole = adminCount === 0 ? "Owner" : role;

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("An admin with that email already exists");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role: finalRole,
    avatar: avatar || `https://picsum.photos/seed/${encodeURIComponent(email)}/200`,
  });

  res.status(201).json({
    success: true,
    bootstrap: adminCount === 0,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      createdAt: admin.createdAt,
    },
  });
});

// GET /api/auth/admins  (Owner only) — list all admins
export const listAdmins = asyncHandler(async (req, res) => {
  if (req.admin.role !== "Owner") {
    res.status(403);
    throw new Error("Only Owner accounts can view the admin list");
  }
  const admins = await Admin.find().sort({ createdAt: -1 });
  res.json({ success: true, count: admins.length, admins });
});

// DELETE /api/auth/admins/:id  (Owner only)
export const deleteAdmin = asyncHandler(async (req, res) => {
  if (req.admin.role !== "Owner") {
    res.status(403);
    throw new Error("Only Owner accounts can delete admins");
  }
  if (req.params.id === String(req.admin._id)) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }
  res.json({ success: true, message: "Admin deleted" });
});

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import {
  deleteAdmin,
  listAdmins,
  login,
  logout,
  me,
  register,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

const isDev = process.env.NODE_ENV !== "production";

// 5 login attempts per 15 minutes per IP (disabled in development)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: { success: false, message: "Too many login attempts. Try again later." },
});

// 10 register attempts per hour per IP (disabled in development)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: { success: false, message: "Too many registration attempts. Try again later." },
});

router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 1 }).withMessage("Password required"),
  ],
  login
);

router.post(
  "/register",
  registerLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["Owner", "Manager", "Staff"])
      .withMessage("Role must be Owner, Manager, or Staff"),
  ],
  register
);

router.post("/logout", logout);
router.get("/me", protect, me);

// Admin management — Owner only (role check inside controller)
router.get("/admins", protect, listAdmins);
router.delete("/admins/:id", protect, deleteAdmin);

export default router;

import { Router } from "express";
import { body } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  relatedProducts,
  updateProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

const productValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("style").trim().notEmpty().withMessage("Style is required"),
  body("material").trim().notEmpty().withMessage("Material is required"),
  body("colors").isArray({ min: 1 }).withMessage("At least one color variant is required"),
  body("colors.*.name").notEmpty().withMessage("Color name required"),
  body("colors.*.code").notEmpty().withMessage("Color code required"),
  body("colors.*.image").notEmpty().withMessage("Color image required"),
];

// Public
router.get("/", listProducts);
router.get("/:id", getProduct);
router.get("/:id/related", relatedProducts);

// Admin
router.post("/", protect, productValidators, createProduct);
router.put("/:id", protect, productValidators, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;

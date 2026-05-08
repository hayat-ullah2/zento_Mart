import { Router } from "express";
import {
  createPromotion,
  deletePromotion,
  getPromotion,
  listPromotions,
  updatePromotion,
  validatePromotion,
} from "../controllers/promotionController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/validate", validatePromotion); // public — checkout uses this
router.get("/", protect, listPromotions);
router.post("/", protect, createPromotion);
router.get("/:id", protect, getPromotion);
router.put("/:id", protect, updatePromotion);
router.delete("/:id", protect, deletePromotion);

export default router;

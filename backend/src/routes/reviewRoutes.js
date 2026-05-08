import { Router } from "express";
import {
  createReview,
  deleteReview,
  getReview,
  listReviews,
  updateReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", createReview); // public — anyone can submit a review (defaults to Pending)
router.get("/", listReviews); // public — storefront can list approved reviews via ?status=Approved
router.get("/:id", getReview);
router.put("/:id", protect, updateReview); // admin: approve/reject/reply
router.delete("/:id", protect, deleteReview);

export default router;

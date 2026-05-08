import { Router } from "express";
import {
  deleteSubscriber,
  listSubscribers,
  subscribe,
} from "../controllers/subscriberController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", subscribe); // public — newsletter form
router.get("/", protect, listSubscribers);
router.delete("/:id", protect, deleteSubscriber);

export default router;

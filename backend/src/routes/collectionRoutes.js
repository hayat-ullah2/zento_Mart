import { Router } from "express";
import {
  createCollection,
  deleteCollection,
  getCollection,
  listCollections,
  updateCollection,
} from "../controllers/collectionController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listCollections); // public — storefront uses these too
router.get("/:id", getCollection);
router.post("/", protect, createCollection);
router.put("/:id", protect, updateCollection);
router.delete("/:id", protect, deleteCollection);

export default router;

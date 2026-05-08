import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  getBanner,
  listBanners,
  updateBanner,
} from "../controllers/bannerController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listBanners); // public — storefront reads active banners
router.get("/:id", getBanner);
router.post("/", protect, createBanner);
router.put("/:id", protect, updateBanner);
router.delete("/:id", protect, deleteBanner);

export default router;

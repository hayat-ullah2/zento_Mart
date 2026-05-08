import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getSettings); // public — storefront reads currency, free-ship threshold, etc.
router.put("/", protect, updateSettings);

export default router;

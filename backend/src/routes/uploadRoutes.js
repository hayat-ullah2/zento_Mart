import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { deleteUpload, getUploadConfig, uploadImage } from "../controllers/uploadController.js";

const router = Router();

// All upload endpoints require admin auth.
router.use(protect);

router.get("/config", getUploadConfig);

// Single-image upload - field name is "image".
router.post("/", upload.single("image"), uploadImage);

router.delete("/:filename", deleteUpload);

export default router;

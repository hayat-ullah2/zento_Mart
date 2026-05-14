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

// Wildcard so Cloudinary public_ids that contain "/" (e.g. zentomart/products/abc)
// can be passed in the URL path. Express captures the rest in req.params[0].
router.delete("/*", deleteUpload);

export default router;

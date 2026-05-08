import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

// Keep the legacy uploads directory available for old /uploads URLs.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only JPEG, PNG, WebP, GIF, and AVIF images are allowed"));
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8 MB per image
  },
});

export { UPLOAD_DIR };

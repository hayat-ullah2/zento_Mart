import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import {
  assertCloudinaryConfigured,
  cloudinaryConfig,
  deleteByPublicId,
  isCloudinaryConfigured,
  uploadBuffer,
} from "../config/cloudinary.js";
import { UPLOAD_DIR } from "../middleware/upload.js";

const sanitizePublicId = (name = "image") => {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const safeBase = base || "image";
  // Cloudinary public_ids should NOT include the extension — Cloudinary derives
  // it from the uploaded file's mime/format and appends it to the URL.
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeBase}`;
};

// GET /api/uploads/config - public Cloudinary settings the admin frontend needs
export const getUploadConfig = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    provider: "cloudinary",
    configured: isCloudinaryConfigured(),
    cloudName: cloudinaryConfig.cloudName,
    maxFileSizeMb: 8,
  });
});

// POST /api/uploads - single image to Cloudinary
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file received - send field 'image' as multipart/form-data");
  }

  assertCloudinaryConfigured();

  const publicId = sanitizePublicId(req.file.originalname);

  let result;
  try {
    result = await uploadBuffer(req.file.buffer, {
      publicId,
      folder: "zentomart/products",
      tags: ["zentomart", "admin-upload"],
    });
  } catch (err) {
    console.error("[upload] Cloudinary upload failed:", {
      message: err.message,
      http_code: err.http_code,
      name: err.name,
      originalname: req.file.originalname,
      size: req.file.size,
      mime: req.file.mimetype,
    });
    const status = typeof err.http_code === "number" ? err.http_code : 502;
    res.status(status);
    throw new Error(`Cloudinary upload failed (${status}): ${err.message}`);
  }

  // `fileId` is kept as an alias of `publicId` for backwards compatibility with
  // any existing schema fields / frontend code that expected an ImageKit fileId.
  res.status(201).json({
    success: true,
    url: result.secure_url,
    fileId: result.public_id,
    publicId: result.public_id,
    filePath: result.secure_url,
    filename: result.original_filename || publicId,
    size: result.bytes || req.file.size,
    mimeType: req.file.mimetype,
    thumbnailUrl: result.secure_url,
    width: result.width,
    height: result.height,
  });
});

// DELETE /api/uploads/* - delete a Cloudinary image by public_id
// Cloudinary public_ids contain "/" (e.g. "zentomart/products/abc-123"), which
// is why this route uses a wildcard rather than a single :param.
export const deleteUpload = asyncHandler(async (req, res) => {
  // Express stores wildcard match in req.params[0]
  const publicIdOrName = req.params[0] || req.params.filename;

  if (!publicIdOrName || publicIdOrName.includes("..") || publicIdOrName.includes("\\")) {
    res.status(400);
    throw new Error("Invalid file identifier");
  }

  // Legacy local-file deletion still supported for old /uploads/<file> assets.
  // (Single-segment names only — Cloudinary public_ids contain "/" so they
  // can't collide with this branch.)
  if (!publicIdOrName.includes("/")) {
    const legacyFilePath = path.join(UPLOAD_DIR, publicIdOrName);
    if (fs.existsSync(legacyFilePath)) {
      fs.unlinkSync(legacyFilePath);
      return res.json({ success: true, message: "Local file deleted" });
    }
  }

  assertCloudinaryConfigured();
  const result = await deleteByPublicId(publicIdOrName);
  res.json({
    success: true,
    message: "Cloudinary file deleted",
    result: result?.result,
  });
});

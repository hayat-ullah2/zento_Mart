import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import {
  assertImageKitConfigured,
  imageKitConfig,
  bufferToImageKitFile,
  imageKit,
  isImageKitConfigured,
} from "../config/imagekit.js";
import { UPLOAD_DIR } from "../middleware/upload.js";

const sanitizeFileName = (name = "image") => {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const safeBase = base || "image";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeBase}${ext}`;
};

// GET /api/uploads/config - public ImageKit settings for the admin frontend
export const getUploadConfig = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    provider: "imagekit",
    configured: isImageKitConfigured(),
    publicKey: imageKitConfig.publicKey,
    urlEndpoint: imageKitConfig.urlEndpoint,
    imageKitId: imageKitConfig.imageKitId,
    maxFileSizeMb: 8,
  });
});

// POST /api/uploads - single image to ImageKit
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file received - send field 'image' as multipart/form-data");
  }

  assertImageKitConfigured();

  const fileName = sanitizeFileName(req.file.originalname);

  let uploadResponse;
  try {
    uploadResponse = await imageKit.files.upload({
      file: await bufferToImageKitFile(req.file.buffer, fileName),
      fileName,
      folder: "/zentomart/products",
      useUniqueFileName: false,
      tags: ["zentomart", "admin-upload"],
    });
  } catch (err) {
    console.error("[upload] ImageKit upload failed:", {
      status: err.status,
      message: err.message,
      fileName,
      originalname: req.file.originalname,
      size: req.file.size,
      mime: req.file.mimetype,
      requestId: err.headers?.get?.("x-ik-requestid"),
      body: err.error,
    });
    const status = typeof err.status === "number" ? err.status : 502;
    res.status(status);
    throw new Error(`ImageKit upload failed (${status}): ${err.message}`);
  }

  res.status(201).json({
    success: true,
    url: uploadResponse.url,
    fileId: uploadResponse.fileId,
    filePath: uploadResponse.filePath,
    filename: uploadResponse.name || fileName,
    size: uploadResponse.size || req.file.size,
    mimeType: req.file.mimetype,
    thumbnailUrl: uploadResponse.thumbnailUrl,
    width: uploadResponse.width,
    height: uploadResponse.height,
  });
});

// DELETE /api/uploads/:fileId - delete an ImageKit file by fileId.
// Legacy local filenames are still supported for old /uploads assets.
export const deleteUpload = asyncHandler(async (req, res) => {
  const { filename: fileIdOrName } = req.params;

  if (fileIdOrName.includes("..") || fileIdOrName.includes("/") || fileIdOrName.includes("\\")) {
    res.status(400);
    throw new Error("Invalid file identifier");
  }

  const legacyFilePath = path.join(UPLOAD_DIR, fileIdOrName);
  if (fs.existsSync(legacyFilePath)) {
    fs.unlinkSync(legacyFilePath);
    return res.json({ success: true, message: "Local file deleted" });
  }

  assertImageKitConfigured();
  await imageKit.files.delete(fileIdOrName);
  res.json({ success: true, message: "ImageKit file deleted" });
});

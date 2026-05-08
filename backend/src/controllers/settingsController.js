import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";

// GET /api/settings — public read of store-facing config (currency, free-ship threshold, etc.)
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({}); // first read = first save
  res.json({ success: true, settings });
});

// PUT /api/settings — admin only
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  res.json({ success: true, settings });
});

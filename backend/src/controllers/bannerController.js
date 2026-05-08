import asyncHandler from "express-async-handler";
import Banner from "../models/Banner.js";

export const listBanners = asyncHandler(async (req, res) => {
  const { status, placement } = req.query;
  const filter = {};
  if (status && status !== "All") filter.status = status;
  if (placement) filter.placement = placement;
  const banners = await Banner.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: banners.length, banners });
});

export const getBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }
  res.json({ success: true, banner });
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, banner });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }
  res.json({ success: true, banner });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }
  res.json({ success: true, message: "Banner deleted" });
});

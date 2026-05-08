import asyncHandler from "express-async-handler";
import Promotion from "../models/Promotion.js";

export const listPromotions = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status && status !== "All" ? { status } : {};
  const promotions = await Promotion.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: promotions.length, promotions });
});

export const getPromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  if (!promotion) {
    res.status(404);
    throw new Error("Promotion not found");
  }
  res.json({ success: true, promotion });
});

export const createPromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.create(req.body);
  res.status(201).json({ success: true, promotion });
});

export const updatePromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!promotion) {
    res.status(404);
    throw new Error("Promotion not found");
  }
  res.json({ success: true, promotion });
});

export const deletePromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findByIdAndDelete(req.params.id);
  if (!promotion) {
    res.status(404);
    throw new Error("Promotion not found");
  }
  res.json({ success: true, message: "Promotion deleted" });
});

// Public coupon validator — POST /api/promotions/validate { code, subtotal }
export const validatePromotion = asyncHandler(async (req, res) => {
  const { code, subtotal = 0 } = req.body;
  if (!code) {
    res.status(400);
    throw new Error("Coupon code required");
  }
  const promo = await Promotion.findOne({ code: code.toUpperCase() });
  if (!promo) {
    res.status(404);
    throw new Error("Invalid coupon");
  }
  if (promo.status !== "Active") {
    res.status(400);
    throw new Error(`Coupon ${promo.status.toLowerCase()}`);
  }
  if (promo.expires && promo.expires < new Date()) {
    res.status(400);
    throw new Error("Coupon has expired");
  }
  if (promo.minSpend > subtotal) {
    res.status(400);
    throw new Error(`Minimum spend $${promo.minSpend} not reached`);
  }
  res.json({ success: true, promotion: promo });
});

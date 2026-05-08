import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";

export const listReviews = asyncHandler(async (req, res) => {
  const { status, productId } = req.query;
  const filter = {};
  if (status && status !== "All") filter.status = status;
  if (productId) filter.productId = Number(productId);
  const reviews = await Review.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, reviews });
});

export const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.json({ success: true, review });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, review });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.json({ success: true, review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.json({ success: true, message: "Review deleted" });
});

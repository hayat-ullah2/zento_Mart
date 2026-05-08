import asyncHandler from "express-async-handler";
import Collection from "../models/Collection.js";

export const listCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: collections.length, collections });
});

export const getCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }
  res.json({ success: true, collection });
});

export const createCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.create(req.body);
  res.status(201).json({ success: true, collection });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }
  res.json({ success: true, collection });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndDelete(req.params.id);
  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }
  res.json({ success: true, message: "Collection deleted" });
});

import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Product from "../models/Product.js";

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join("; "));
  }
};

// GET /api/products  (public)
// Query: search, style, material, minPrice, maxPrice, color, sort, limit
export const listProducts = asyncHandler(async (req, res) => {
  const { search, style, material, minPrice, maxPrice, color, sort, limit } = req.query;
  const filter = {};

  if (search) {
    const rx = new RegExp(search, "i");
    filter.$or = [{ name: rx }, { description: rx }, { style: rx }, { material: rx }];
  }
  if (style) filter.style = style;
  if (material) filter.material = material;
  if (color) filter["colors.name"] = color;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let query = Product.find(filter);

  switch (sort) {
    case "price-asc":
      query = query.sort({ price: 1 });
      break;
    case "price-desc":
      query = query.sort({ price: -1 });
      break;
    case "rating":
      query = query.sort({ rating: -1 });
      break;
    case "best":
      query = query.sort({ reviews: -1 });
      break;
    case "new":
      query = query.sort({ isNew: -1, createdAt: -1 });
      break;
    default:
      query = query.sort({ isBestSeller: -1, createdAt: -1 });
  }

  if (limit) query = query.limit(Number(limit));

  const products = await query.exec();
  res.json({ success: true, count: products.length, products });
});

// GET /api/products/:id  (public) — accepts numeric id or Mongo _id
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = isNaN(Number(id))
    ? await Product.findById(id)
    : await Product.findOne({ id: Number(id) });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

// POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  validate(req, res);

  const data = { ...req.body };
  if (req.admin) data.createdBy = req.admin._id;
  if (!data.mainImage && data.colors?.[0]?.image) data.mainImage = data.colors[0].image;

  const product = await Product.create(data);
  res.status(201).json({ success: true, product });
});

// PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  validate(req, res);

  const { id } = req.params;
  const product = isNaN(Number(id))
    ? await Product.findById(id)
    : await Product.findOne({ id: Number(id) });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  if (req.body.colors?.[0]?.image && !req.body.mainImage) {
    product.mainImage = req.body.colors[0].image;
  }
  product.inStock = (req.body.stock ?? product.stock) > 0;

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = isNaN(Number(id))
    ? await Product.findById(id)
    : await Product.findOne({ id: Number(id) });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ success: true, message: "Product deleted" });
});

// GET /api/products/:id/related  (public)
export const relatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = isNaN(Number(id))
    ? await Product.findById(id)
    : await Product.findOne({ id: Number(id) });

  if (!product) return res.json({ success: true, products: [] });

  const related = await Product.find({
    _id: { $ne: product._id },
    $or: [{ style: product.style }, { material: product.material }],
  })
    .limit(6)
    .sort({ reviews: -1 });

  res.json({ success: true, products: related });
});

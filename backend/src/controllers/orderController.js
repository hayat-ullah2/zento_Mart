import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

export const listOrders = asyncHandler(async (req, res) => {
  const { status, search, limit } = req.query;
  const filter = {};
  if (status && status !== "All") filter.status = status;
  if (search) {
    const rx = new RegExp(search, "i");
    filter.$or = [
      { code: rx },
      { "customer.name": rx },
      { "customer.email": rx },
    ];
  }
  let q = Order.find(filter).sort({ createdAt: -1 });
  if (limit) q = q.limit(Number(limit));
  const orders = await q.exec();
  res.json({ success: true, count: orders.length, orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  // Accept either Mongo _id or human-readable code (e.g. ZM-1042)
  const { id } = req.params;
  const order = mongoIdLike(id)
    ? await Order.findById(id)
    : await Order.findOne({ code: id.toUpperCase() });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json({ success: true, order });
});

export const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json({ success: true, order });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = mongoIdLike(id)
    ? await Order.findById(id)
    : await Order.findOne({ code: id.toUpperCase() });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  Object.assign(order, req.body);
  const updated = await order.save();
  res.json({ success: true, order: updated });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = mongoIdLike(id)
    ? await Order.findByIdAndDelete(id)
    : await Order.findOneAndDelete({ code: id.toUpperCase() });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json({ success: true, message: "Order deleted" });
});

const mongoIdLike = (s) => /^[0-9a-fA-F]{24}$/.test(s);

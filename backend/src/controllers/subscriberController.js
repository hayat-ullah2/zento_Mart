import asyncHandler from "express-async-handler";
import Subscriber from "../models/Subscriber.js";

export const listSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.json({ success: true, count: subscribers.length, subscribers });
});

// Public — anyone can subscribe via the storefront newsletter form
export const subscribe = asyncHandler(async (req, res) => {
  const { email, source = "Newsletter signup" } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }
  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.json({ success: true, message: "Already subscribed", subscriber: existing });
  }
  const subscriber = await Subscriber.create({ email, source });
  res.status(201).json({ success: true, subscriber });
});

export const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
  if (!subscriber) {
    res.status(404);
    throw new Error("Subscriber not found");
  }
  res.json({ success: true, message: "Subscriber removed" });
});

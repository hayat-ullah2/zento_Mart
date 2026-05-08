import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: Number, index: true },
    productName: { type: String, required: true },
    customer: { type: String, required: true },
    customerEmail: String,
    avatar: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reply: String,
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number },
    name: { type: String, required: true },
    color: String,
    size: String,
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      avatar: String,
    },
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
      default: "Pending",
    },
    payment: {
      method: { type: String, default: "Cash on Delivery" },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Refunded", "Failed"],
        default: "Pending",
      },
    },
    tracking: {
      carrier: String,
      number: String,
    },
    notes: String,
  },
  { timestamps: true }
);

// Auto-assign sequential ZM-#### code on create
orderSchema.pre("validate", async function (next) {
  if (!this.code) {
    const last = await this.constructor.findOne({}, { code: 1 }).sort({ createdAt: -1 }).lean();
    const lastNum = last?.code ? parseInt(last.code.split("-")[1], 10) : 1000;
    this.code = `ZM-${lastNum + 1}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;

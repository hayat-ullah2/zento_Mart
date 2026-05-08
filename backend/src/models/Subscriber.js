import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    source: {
      type: String,
      enum: ["Newsletter signup", "Checkout opt-in", "Account creation", "Other"],
      default: "Newsletter signup",
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
export default Subscriber;

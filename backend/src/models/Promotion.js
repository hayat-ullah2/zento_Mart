import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: {
      type: String,
      enum: ["% off", "$ off", "Free shipping"],
      default: "% off",
    },
    value: { type: Number, default: 0, min: 0 },
    minSpend: { type: Number, default: 0, min: 0 },
    expires: Date,
    used: { type: Number, default: 0, min: 0 },
    limit: { type: Number, default: 0, min: 0 }, // 0 = unlimited
    status: {
      type: String,
      enum: ["Active", "Scheduled", "Expired"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Auto-flip status to Expired when expiry passes
promotionSchema.pre("save", function (next) {
  if (this.expires && this.expires < new Date()) this.status = "Expired";
  next();
});

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;

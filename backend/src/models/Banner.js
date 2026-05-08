import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    placement: {
      type: String,
      enum: ["Homepage Hero", "Homepage Mid", "Top Announcement", "Cart Page"],
      default: "Homepage Hero",
    },
    image: String,
    link: String,
    schedule: String, // human-readable for now
    startsAt: Date,
    endsAt: Date,
    status: {
      type: String,
      enum: ["Active", "Scheduled", "Inactive"],
      default: "Inactive",
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;

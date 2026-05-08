import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    image: String,
    productIds: { type: [Number], default: [] }, // numeric product ids
    status: {
      type: String,
      enum: ["Active", "Draft", "Archived"],
      default: "Draft",
    },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

collectionSchema.virtual("productCount").get(function () {
  return this.productIds?.length || 0;
});
collectionSchema.set("toJSON", { virtuals: true });

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;

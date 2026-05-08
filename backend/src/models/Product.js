import mongoose from "mongoose";

const colorVariantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Numeric id matching the React frontend's existing structure
    id: { type: Number, unique: true, index: true },

    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null, min: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    style: { type: String, required: true, trim: true },
    material: { type: String, required: true, trim: true },
    gender: { type: String, default: "Women" },

    sizes: { type: [String], default: ["One Size"] },
    colors: {
      type: [colorVariantSchema],
      validate: [(v) => v.length > 0, "At least one color variant is required"],
    },

    stock: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },

    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },

    mainImage: { type: String, required: true },
    gallery: { type: [String], default: [] },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Auto-derive inStock and mainImage on save
productSchema.pre("save", function (next) {
  this.inStock = this.stock > 0;
  if (!this.mainImage && this.colors?.[0]?.image) {
    this.mainImage = this.colors[0].image;
  }
  next();
});

// Auto-assign a numeric id on first save when not provided
productSchema.pre("validate", async function (next) {
  if (this.id == null) {
    const last = await this.constructor.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
    this.id = (last?.id || 0) + 1;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;

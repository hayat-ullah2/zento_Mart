import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["Owner", "Manager", "Staff"],
      default: "Manager",
    },
    avatar: {
      type: String,
      default: "https://picsum.photos/seed/admin/200",
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Hash password before save
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance helper to verify a plaintext password
adminSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;

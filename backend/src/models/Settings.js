import mongoose from "mongoose";

// Singleton-style document — only one row in the collection.
// `findOneAndUpdate({}, {...}, { upsert: true, new: true })` reads/writes it.
const settingsSchema = new mongoose.Schema(
  {
    store: {
      name: { type: String, default: "ZentoMart" },
      tagline: { type: String, default: "Carry the art of arrival." },
      email: { type: String, default: "concierge@zentomart.com" },
      phone: { type: String, default: "+92 300 1234567" },
      address: { type: String, default: "Karachi, Pakistan" },
      currency: { type: String, default: "PKR" },
    },
    shipping: {
      freeOver: { type: Number, default: 5000 },
      standard: { type: Number, default: 250 },
      express: { type: Number, default: 500 },
      zones: { type: String, default: "All major cities across Pakistan" },
    },
    payment: {
      cashOnDelivery: { type: Boolean, default: true },
      bankTransfer: { type: Boolean, default: false },
      easypaisa: { type: Boolean, default: false },
      jazzcash: { type: Boolean, default: false },
    },
    tax: {
      defaultRate: { type: Number, default: 0 },
      applyToShipping: { type: Boolean, default: false },
    },
    notifications: {
      orderPlacedAdmin: { type: Boolean, default: true },
      orderPlacedCustomer: { type: Boolean, default: true },
      orderShipped: { type: Boolean, default: true },
      orderDelivered: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      newReview: { type: Boolean, default: false },
      weeklyDigest: { type: Boolean, default: true },
    },
    theme: {
      primaryColor: { type: String, default: "#6a5b5e" },
      headingFont: { type: String, default: "Noto Serif" },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;

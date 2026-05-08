// One-shot script to clear every collection EXCEPT admins and settings.
// Use it to reset the database to a clean slate before adding your own products.
//
// Usage:
//   npm run wipe           # interactive — asks for confirmation
//   npm run wipe -- --yes  # skip the prompt (CI / scripts)

import dotenv from "dotenv";
dotenv.config();

import readline from "readline";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Promotion from "../models/Promotion.js";
import Review from "../models/Review.js";
import Collection from "../models/Collection.js";
import Banner from "../models/Banner.js";
import Subscriber from "../models/Subscriber.js";

const TARGETS = [
  { Model: Product, label: "Products" },
  { Model: Order, label: "Orders" },
  { Model: Customer, label: "Customers" },
  { Model: Promotion, label: "Promotions" },
  { Model: Review, label: "Reviews" },
  { Model: Collection, label: "Collections" },
  { Model: Banner, label: "Banners" },
  { Model: Subscriber, label: "Subscribers" },
];

const confirm = () =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("\n⚠️  This will permanently delete ALL data above. Type 'WIPE' to confirm: ", (answer) => {
      rl.close();
      resolve(answer === "WIPE");
    });
  });

const run = async () => {
  await connectDB();

  console.log("\n📊 Current document counts:");
  const counts = await Promise.all(
    TARGETS.map(async ({ Model, label }) => ({ label, count: await Model.countDocuments() }))
  );
  counts.forEach(({ label, count }) => console.log(`   ${label.padEnd(15)} ${count}`));

  const skipPrompt = process.argv.includes("--yes") || process.argv.includes("-y");

  if (!skipPrompt) {
    const ok = await confirm();
    if (!ok) {
      console.log("\n✖ Aborted — no changes made.");
      await mongoose.disconnect();
      return;
    }
  }

  console.log("\n🧹 Wiping collections...");
  for (const { Model, label } of TARGETS) {
    const result = await Model.deleteMany({});
    console.log(`   ✓ ${label.padEnd(15)} deleted ${result.deletedCount}`);
  }

  console.log("\n🧷 Kept intact:");
  console.log("   ✓ Admins (so you can still log in)");
  console.log("   ✓ Settings (store config)");
  console.log("\nDone — database is now clean. Add your first product via /admin/products/new.\n");

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("✖ Wipe failed:", err);
  process.exit(1);
});

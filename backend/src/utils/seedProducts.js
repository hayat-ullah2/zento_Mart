import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import { productSeeds } from "./productSeedData.js";

const seed = async () => {
  await connectDB();

  const args = process.argv.slice(2);
  const wipe = args.includes("--wipe");

  if (wipe) {
    await Product.deleteMany({});
    console.log("• Cleared existing products");
  }

  let created = 0;
  let skipped = 0;

  for (const seed of productSeeds) {
    const existing = await Product.findOne({ id: seed.id });
    if (existing) {
      skipped++;
      continue;
    }
    await Product.create(seed);
    created++;
  }

  console.log(`✓ Created ${created} products, skipped ${skipped} existing`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("✖ Seed failed:", err);
  process.exit(1);
});

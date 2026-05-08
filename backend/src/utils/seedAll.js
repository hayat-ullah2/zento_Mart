import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Promotion from "../models/Promotion.js";
import Review from "../models/Review.js";
import Collection from "../models/Collection.js";
import Banner from "../models/Banner.js";
import Subscriber from "../models/Subscriber.js";
import Settings from "../models/Settings.js";
import {
  bannerSeeds,
  collectionSeeds,
  customerSeeds,
  orderSeeds,
  promotionSeeds,
  reviewSeeds,
  subscriberSeeds,
} from "./phase2SeedData.js";

const seedCollection = async (Model, seeds, label, uniqueField) => {
  let created = 0;
  let skipped = 0;
  for (const seed of seeds) {
    const existing = uniqueField
      ? await Model.findOne({ [uniqueField]: seed[uniqueField] })
      : null;
    if (existing) {
      skipped++;
      continue;
    }
    await Model.create(seed);
    created++;
  }
  console.log(`✓ ${label}: created ${created}, skipped ${skipped}`);
};

const run = async () => {
  await connectDB();

  await seedCollection(Customer, customerSeeds, "Customers", "email");
  await seedCollection(Order, orderSeeds, "Orders", "code");
  await seedCollection(Promotion, promotionSeeds, "Promotions", "code");
  await seedCollection(Review, reviewSeeds, "Reviews", "title");
  await seedCollection(Collection, collectionSeeds, "Collections", "name");
  await seedCollection(Banner, bannerSeeds, "Banners", "title");
  await seedCollection(Subscriber, subscriberSeeds, "Subscribers", "email");

  // Settings — singleton
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({});
    console.log("✓ Settings: created defaults");
  } else {
    console.log("• Settings: already exists");
  }

  await mongoose.disconnect();
  console.log("\nDone seeding Phase 2 data.");
};

run().catch((err) => {
  console.error("✖ Seed failed:", err);
  process.exit(1);
});

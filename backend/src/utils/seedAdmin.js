import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

const seedAdmins = async () => {
  await connectDB();

  const seeds = [
    {
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      name: process.env.SEED_ADMIN_NAME,
      role: "Owner",
      avatar: "https://picsum.photos/seed/admin1/200",
    },
    {
      email: process.env.SEED_MANAGER_EMAIL,
      password: process.env.SEED_MANAGER_PASSWORD,
      name: process.env.SEED_MANAGER_NAME,
      role: "Manager",
      avatar: "https://picsum.photos/seed/admin2/200",
    },
  ].filter((s) => s.email && s.password);

  for (const seed of seeds) {
    const existing = await Admin.findOne({ email: seed.email.toLowerCase() });
    if (existing) {
      console.log(`• Admin already exists: ${seed.email} (${existing.role})`);
      continue;
    }
    const admin = await Admin.create(seed);
    console.log(`✓ Created admin: ${admin.email} (${admin.role})`);
  }

  await mongoose.disconnect();
  console.log("\nDone seeding admins.");
};

seedAdmins().catch((err) => {
  console.error("✖ Seed failed:", err);
  process.exit(1);
});

import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ ZentoMart API running on http://localhost:${PORT}  [${process.env.NODE_ENV}]`);
  });
};

process.on("unhandledRejection", (err) => {
  console.error("✖ Unhandled Rejection:", err);
  process.exit(1);
});

start();

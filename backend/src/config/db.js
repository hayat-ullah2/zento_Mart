import mongoose from "mongoose";
import dns from "dns";

// Workaround for Windows / ISP DNS resolvers that can't follow the SRV records
// `mongodb+srv://` requires. Skip in production — Render's resolver works fine
// and overriding it can cause SRV lookups to fail.
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("✖ MONGO_URI is not set in .env");
    process.exit(1);
  }
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error("✖ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;

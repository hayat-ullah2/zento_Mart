import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { UPLOAD_DIR } from "./middleware/upload.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// --- Security & body parsing ----------------------------------------------
// helmet — relaxed `crossOriginResourcePolicy` so uploaded images can render in <img> from another origin
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow tools like curl/Postman with no origin
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// --- Routes ----------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    name: "ZentoMart API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders",
      customers: "/api/customers",
      promotions: "/api/promotions",
      reviews: "/api/reviews",
      collections: "/api/collections",
      banners: "/api/banners",
      subscribers: "/api/subscribers",
      settings: "/api/settings",
      analytics: "/api/analytics",
      uploads: "/api/uploads (POST multipart 'image')",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// Serve uploaded images statically (long-cache, immutable filenames)
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    maxAge: "30d",
    immutable: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/uploads", uploadRoutes);

// --- Error handling -------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

export default app;

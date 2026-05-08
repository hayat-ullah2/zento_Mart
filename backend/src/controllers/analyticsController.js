import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

// GET /api/analytics/dashboard — KPIs + alerts for the admin home
export const dashboard = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const [
    todayOrders,
    yesterdayOrders,
    productCount,
    customerCount,
    lowStock,
    outOfStock,
    pendingReviews,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    Order.find({ createdAt: { $gte: startOfToday } }),
    Order.find({ createdAt: { $gte: startOfYesterday, $lt: startOfToday } }),
    Product.countDocuments(),
    Customer.countDocuments(),
    Product.find({ stock: { $gt: 0, $lte: 10 } }).limit(4),
    Product.find({ stock: 0 }).limit(4),
    Review.countDocuments({ status: "Pending" }),
    Order.find().sort({ createdAt: -1 }).limit(6),
    Product.find().sort({ reviews: -1 }).limit(5),
  ]);

  const sumRevenue = (orders) =>
    orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const todayRevenue = sumRevenue(todayOrders);
  const yesterdayRevenue = sumRevenue(yesterdayOrders);
  const revenueChange =
    yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0;

  res.json({
    success: true,
    kpis: {
      todayRevenue,
      revenueChange: Number(revenueChange.toFixed(1)),
      todayOrders: todayOrders.length,
      productCount,
      customerCount,
      pendingReviews,
    },
    alerts: { lowStock, outOfStock },
    recentOrders,
    topProducts,
  });
});

// GET /api/analytics/sales?days=14 — daily revenue/orders for charts
export const salesTimeSeries = asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days) || 14, 1), 365);
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const buckets = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          y: { $year: "$createdAt" },
          m: { $month: "$createdAt" },
          d: { $dayOfMonth: "$createdAt" },
        },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
  ]);

  // Fill any zero days so the chart has continuous x-axis
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const match = buckets.find(
      (b) =>
        b._id.y === d.getFullYear() &&
        b._id.m === d.getMonth() + 1 &&
        b._id.d === d.getDate()
    );
    out.push({
      day: d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      revenue: match?.revenue || 0,
      orders: match?.orders || 0,
    });
  }

  res.json({ success: true, days, data: out });
});

// GET /api/analytics/top-products — by reviews count (proxy for popularity)
export const topProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const products = await Product.find().sort({ reviews: -1, rating: -1 }).limit(limit);
  res.json({ success: true, products });
});

// GET /api/analytics/traffic-sources — static for now (no real traffic tracking)
export const trafficSources = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    sources: [
      { name: "Direct", value: 38, color: "#6a5b5e" },
      { name: "Instagram", value: 27, color: "#1c1b1b" },
      { name: "Google", value: 19, color: "#735c00" },
      { name: "Email", value: 11, color: "#5e604d" },
      { name: "Other", value: 5, color: "#d5c2c6" },
    ],
  });
});

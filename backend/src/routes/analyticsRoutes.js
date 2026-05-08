import { Router } from "express";
import {
  dashboard,
  salesTimeSeries,
  topProducts,
  trafficSources,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect); // analytics is admin-only
router.get("/dashboard", dashboard);
router.get("/sales", salesTimeSeries);
router.get("/top-products", topProducts);
router.get("/traffic-sources", trafficSources);

export default router;

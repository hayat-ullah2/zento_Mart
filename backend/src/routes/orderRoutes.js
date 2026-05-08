import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  listOrders,
  updateOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", createOrder); // public — storefront checkout
router.get("/", protect, listOrders);
router.get("/:id", protect, getOrder);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

export default router;

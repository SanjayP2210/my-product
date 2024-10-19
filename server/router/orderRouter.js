import express from "express";
import authMiddleWare from '../middleware/authMiddleware.js';
import {
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  newOrder,
  getAllPayments,
  getMonthlyReport
} from "../controller/orderController.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";

const router = express.Router();

router.route("/new").post(authMiddleWare,newOrder);

router.route("/my-orders").get(authMiddleWare,myOrders);

router
  .route("/admin-order/")
  .get(authMiddleWare, getAllOrders);
router
  .route("/admin-order-report")
  .get(authMiddleWare, getMonthlyReport);
router
  .route("/admin-order/get-all-payments/")
  .get(authMiddleWare, getAllPayments);
  
router
  .route("/admin-order/:id")
  .put(authMiddleWare, adminMiddleware, updateOrder)
  .delete(authMiddleWare, adminMiddleware, deleteOrder);

router.route("/:id").get(getSingleOrder);
export default router;

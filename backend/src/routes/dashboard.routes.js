import express from "express";
import {
  getDashboardStats,
  getDashboardTransactions,
} from "../controllers/dashboard.controller.js";
import { authenticateMerchant } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/api/v1/dashboard/stats", authenticateMerchant, getDashboardStats);
router.get(
  "/api/v1/dashboard/transactions",
  authenticateMerchant,
  getDashboardTransactions
);

export default router;

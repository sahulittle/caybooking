import express from "express";
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getEarnings,
  createWithdrawal,
  getVendorWithdrawals,
  getPayments,
  getCategories,
  getPlansByCategory,
  getReviews,
} from "../controllers/vendor.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create vendor profile (only logged-in vendors)
router.post("/create", protect, authorize("vendor"), createVendor);

// Get all vendors (public)
router.get("/", getAllVendors);

// Vendor earnings summary (must be before '/:id' to avoid route param conflicts)
router.get("/earnings", protect, authorize("vendor"), getEarnings);

// Create a withdrawal request
router.post("/withdraw", protect, authorize("vendor"), createWithdrawal);

// Vendor: list own withdrawals
router.get("/withdrawals", protect, authorize("vendor"), getVendorWithdrawals);

// Paginated payments for vendor
router.get("/payments", protect, authorize("vendor"), getPayments);
// Get service categories
router.get("/categories", getCategories);

// Get requirements by category
router.get("/categories/:category", getPlansByCategory);
// Get vendor reviews
router.get('/reviews', protect, authorize('vendor'), getReviews);
// Get single vendor
router.get("/:id", getVendorById);

// Update vendor (owner or admin)
router.put("/:id", protect, updateVendor);

// Delete vendor (admin only)
router.delete("/:id", protect, authorize("admin"), deleteVendor);

export default router;

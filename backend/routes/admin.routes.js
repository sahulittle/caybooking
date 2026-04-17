import express from "express";
import multer from "multer";

import {
  getAllUsersAdmin,
  deleteUser,
  getAllVendorsAdmin,
  verifyVendor,
  deleteVendorAdmin,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  getUserById,
  updateUser,
  createCategory,
  getCategories,
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getAllReviewsAdmin,
  deleteReview,
  // payments/withdrawals
  getAllTransactions,
  getAllWithdrawals,
  updateWithdrawalStatus,
  // notifications
  createNotification,
  getAllNotifications,
  deleteNotification,
} from "../controllers/admin.controller.js";

import { createPlan, updatePlan, deletePlan } from "../controllers/subscription.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Simple logger for admin routes to help debugging incoming requests
router.use((req, res, next) => {
  console.log(`[ADMIN ROUTE] ${req.method} ${req.originalUrl} - headers:`, {
    authorization: req.headers.authorization ? '[REDACTED]' : undefined,
    'x-role': req.headers['x-role'],
  })
  next()
})

// ✅ MULTER SETUP
const upload = multer({ dest: "uploads/" });

// All routes are protected + admin only
router.use(protect, authorize("admin"));

// USER MANAGEMENT
router.get("/users", getAllUsersAdmin);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// ✅ CATEGORY MANAGEMENT (FIXED)
router.post(
  "/categories",
  upload.fields([{ name: "image", maxCount: 1 }]), // 🔥 IMPORTANT
  createCategory
);

router.get("/categories", getCategories);

// ROLE MANAGEMENT
router.get("/users/:id/roles", getUserRoles);
router.put("/users/:id/assign-role", assignRoleToUser);
router.put("/users/:id/remove-role", removeRoleFromUser);

// VENDOR MANAGEMENT
router.get("/vendors", getAllVendorsAdmin);
router.put("/vendors/:id/verify", verifyVendor);
router.delete("/vendors/:id", deleteVendorAdmin);

// SUBSCRIPTION PLANS (admin)
router.post('/subscriptions', createPlan);
router.put('/subscriptions/:id', updatePlan);
router.delete('/subscriptions/:id', deletePlan);

// SERVICE MANAGEMENT

router.post("/services", createService);
router.get("/services", getAllServices);
router.get("/services/:id", getServiceById);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);
// Reviews (admin)
router.get('/reviews', getAllReviewsAdmin);
router.delete('/reviews/:id', deleteReview);

// Payments & Withdrawals (admin)
router.get('/transactions', getAllTransactions);
router.get('/withdrawals', getAllWithdrawals);
router.put('/withdrawals/:id', updateWithdrawalStatus);
// Notifications
router.post('/notifications', createNotification);
router.get('/notifications', getAllNotifications);
router.delete('/notifications/:id', deleteNotification);
export default router;
import express from "express";
import {
  getAllUsersAdmin,
  deleteUser,
  getAllVendorsAdmin,
  verifyVendor,
  deleteVendorAdmin,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles
} from "../controllers/admin.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected + admin only
router.use(protect, authorize("admin"));

// USER MANAGEMENT
router.get("/users", getAllUsersAdmin);
router.delete("/users/:id", deleteUser);

// ROLE MANAGEMENT
router.get("/users/:id/roles", getUserRoles);
router.put("/users/:id/assign-role", assignRoleToUser);
router.put("/users/:id/remove-role", removeRoleFromUser);

// VENDOR MANAGEMENT
router.get("/vendors", getAllVendorsAdmin);
router.put("/vendors/:id/verify", verifyVendor);
router.delete("/vendors/:id", deleteVendorAdmin);

// MAINTENANCE REQUEST MANAGEMENT (Admin)
import { getAllRequests, updateRequest, deleteRequest } from '../controllers/maintenanceRequest.controller.js';

router.get('/maintenance-requests', getAllRequests);
router.put('/maintenance-requests/:id', updateRequest);
router.delete('/maintenance-requests/:id', deleteRequest);

export default router;
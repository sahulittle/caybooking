import express from 'express';
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} from '../controllers/vendor.controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create vendor profile (only logged-in vendors)
router.post('/create', protect, authorize('vendor'), createVendor);

// Get all vendors (public)
router.get('/', getAllVendors);

// Get single vendor
router.get('/:id', getVendorById);

// Update vendor (owner or admin)
router.put('/:id', protect, updateVendor);

// Delete vendor (admin only)
router.delete('/:id', protect, authorize('admin'), deleteVendor);

export default router;
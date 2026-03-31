import express from 'express';
import {
  createMaintenanceRequest,
  getAllRequests,
  updateRequest,
  deleteRequest
} from '../controllers/maintenanceRequest.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createMaintenanceRequest);

router.get('/', protect, authorize('vendor', 'admin'), getAllRequests);
router.put('/:id', protect, authorize('vendor', 'admin'), updateRequest);
router.delete('/:id', protect, authorize('admin'), deleteRequest);

export default router;

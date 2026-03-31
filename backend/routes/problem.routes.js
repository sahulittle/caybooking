import express from 'express';
import {
  createMaintenanceRequest,
  getAllRequests,
  updateRequest,
  deleteRequest
} from '../controllers/maintenanceRequest.controller.js';

const router = express.Router();

// USER
router.post('/', createMaintenanceRequest);

// ADMIN
router.get('/', getAllRequests);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

export default router;
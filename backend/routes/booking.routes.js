import express from 'express';
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingById,
  updateBookingReply,
} from '../controllers/booking.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a booking (user)
router.post('/', protect, authorize('user'), createBooking);

// Get bookings for current authenticated account (user/vendor/admin)
router.get('/', protect, getMyBookings);

// Update booking status (vendor or admin)
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateBookingStatus);
router.get('/:id', getBookingById);
// Vendor can reply to reviews on bookings
router.put('/:id/reply', protect, authorize('vendor'), updateBookingReply);

export default router;
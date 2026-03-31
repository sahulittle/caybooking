import express from 'express';
import {
  createBooking,
  getMyBookings,
  updateBookingStatus
} from '../controllers/booking.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import bookingRoutes from './routes/booking.routes.js'

const router = express.Router();

router.post('/', protect, authorize('user'), createBooking);
router.get('/', protect, getMyBookings);
router.put('/admin/bookings/:id', updateBookingStatus)
app.use('/api', bookingRoutes)
export default router;
import Booking from '../models/booking.model.js';
import Service from '../models/service.model.js';
import { Vendor } from '../models/vendor.model.js';
import { User } from '../models/user.model.js';


// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User only)
const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      serviceTitle,
      planName,
      bookingDate,
      bookingTime,
      address,
      city,
      zip,
      phone,
      notes
    } = req.body;

    if (!bookingDate || !bookingTime || !address || !city || !zip) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });
    }

    let service = null;

    if (serviceId) {
      service = await Service.findById(serviceId);
    }

    if (!service && serviceTitle) {
      service = await Service.findOne({ title: serviceTitle });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    const selectedPlan =
      service.plans.find(p => p.name === planName) || service.plans[0];

    const booking = await Booking.create({
      user: req.user._id,
      vendor: service.vendor,
      service: service._id,
      plan: selectedPlan,
      bookingDate,
      bookingTime,
      address,
      city,
      zip,
      phone,
      notes,
      status: "pending"
    });

    // Emit realtime event to vendor and user rooms so dashboards update live
    try {
      const io = req.app.locals.io;
      if (io) {
        const vendorRoom = `vendor_${service.vendor}`;
        const userRoom = `user_${req.user._id}`;
        io.to(vendorRoom).emit('newBooking', { bookingId: booking._id, booking });
        io.to(userRoom).emit('newBooking', { bookingId: booking._id, booking });
      }
    } catch (emitErr) {
      console.error('Socket emit error (createBooking):', emitErr);
    }

    res.status(201).json({
      success: true,
      message: "Booking created",
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get bookings for the logged in user/vendor
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    let query = {};

    // Filter based on activeRole
    if (req.activeRole === 'vendor') {
      query = { vendor: req.user._id };
    } else if (req.activeRole === 'user') {
      query = { user: req.user._id };
    } else if (req.activeRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const bookings = await Booking.find(query)
      .populate('service', 'title image')
      .populate('user', 'name email')
      .populate('vendor', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Vendor/Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If vendor, ensure they own the booking
    if (req.activeRole === 'vendor') {
      // booking.vendor may be ObjectId
      const vendorId = booking.vendor?.toString();
      const currentVendorId = req.user._id?.toString() || req.user.id?.toString();
      if (vendorId !== currentVendorId) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
      }
    }

    booking.status = status;
    await booking.save();

    // Emit socket events to notify vendor and user
    try {
      const io = req.app.locals.io;
      if (io) {
        const vendorRoom = `vendor_${booking.vendor}`;
        const userRoom = `user_${booking.user}`;
        io.to(vendorRoom).emit('bookingUpdated', { bookingId: booking._id, status });
        io.to(userRoom).emit('bookingUpdated', { bookingId: booking._id, status });
      }
    } catch (emitErr) {
      console.error('Socket emit error:', emitErr);
    }

    res.json({ success: true, message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Update Booking Status Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service")
      .populate("user", "name email")
      .populate("vendor", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ OPTIONAL: if logged in, check ownership
    if (req.user) {
      if (req.user._id.toString() !== booking.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vendor replies to a review on a booking
const updateBookingReply = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { vendorReply } = req.body;

    if (!vendorReply) {
      return res.status(400).json({ success: false, message: 'vendorReply is required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Only vendor who owns the booking can reply
    const vendorId = booking.vendor?.toString();
    const currentVendorId = req.user._id?.toString() || req.user.id?.toString();
    if (vendorId !== currentVendorId && req.activeRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.review = booking.review || {};
    booking.review.vendorReply = vendorReply;
    await booking.save();

    res.json({ success: true, message: 'Reply saved', booking });
  } catch (error) {
    console.error('Update Booking Reply Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingById,
  updateBookingReply,
};
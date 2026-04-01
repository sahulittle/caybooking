import Booking from '../models/booking.model.js';
import Service from '../models/service.model.js';
import { Vendor } from '../models/vendor.model.js';
import { User } from '../models/user.model.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User only)
const createBooking = async (req, res) => {
  try {
    const { serviceId, serviceTitle, planName, bookingDate, bookingTime, address, city, zip, phone, notes } = req.body;

    // Find service by id or title
    let service = null;
    if (serviceId) {
      service = await Service.findById(serviceId);
    }
    if (!service && serviceTitle) {
      service = await Service.findOne({ title: serviceTitle });
    }

    // If not found, try to auto-create a minimal Service and attach to a verified vendor
    if (!service) {
      // Find any verified vendor
      const verifiedVendor = await Vendor.findOne({ isVerified: true }).populate('user');
      let vendorUserId = null;
      if (verifiedVendor) {
        vendorUserId = verifiedVendor.user._id;
      } else if (req.user && req.user.roles.includes('vendor')) {
        vendorUserId = req.user._id;
      }

      if (!vendorUserId) {
        return res.status(400).json({ success: false, message: 'No vendor available to assign this service' });
      }

      service = await Service.create({
        title: serviceTitle || `Service ${Date.now()}`,
        description: '',
        plans: [{ id: 1, name: planName || 'Standard', price: 0 }],
        vendor: vendorUserId
      });
    }

    // 2. Extract chosen plan details
    const selectedPlan = service.plans.find(p => p.name === planName) || service.plans[0];
    if (!selectedPlan) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    // 3. Create booking
    const booking = await Booking.create({
      user: req.user._id,
      vendor: service.vendor, // From the service model
      service: service._id,
      plan: {
        name: selectedPlan.name,
        price: selectedPlan.price
      },
      bookingDate: bookingDate || new Date(),
      bookingTime: bookingTime || '09:00 AM',
      address,
      city,
      zip,
      phone,
      notes
    });

    // Emit socket event to vendor room so vendor gets notified of new booking
    try {
      const io = req.app.locals.io;
      if (io) {
        const vendorRoom = `vendor_${booking.vendor}`;
        io.to(vendorRoom).emit('newBooking', { bookingId: booking._id, service: service.title, plan: booking.plan });
      }
    } catch (emitErr) {
      console.error('Socket emit error (new booking):', emitErr);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('❌ Create Booking Error:', error);
    res.status(500).json({ success: false, message: error.message });
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
// @route   PUT /api/bookings/:id
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

export {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
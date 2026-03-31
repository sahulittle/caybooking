import Booking from '../models/booking.model.js';
import Service from '../models/service.model.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User only)
const createBooking = async (req, res) => {
  try {
    const { serviceId, planName, bookingDate, bookingTime, address, city, zip, phone, notes } = req.body;

    // 1. Find the service and its vendor
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // 2. Extract chosen plan details
    const selectedPlan = service.plans.find(p => p.name === planName);
    if (!selectedPlan) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    // 3. Create booking
    const booking = await Booking.create({
      user: req.user._id,
      vendor: service.vendor, // From the service model
      service: serviceId,
      plan: {
        name: selectedPlan.name,
        price: selectedPlan.price
      },
      bookingDate,
      bookingTime,
      address,
      city,
      zip,
      phone,
      notes
    });

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
  // Logic to update status from 'pending' to 'confirmed' or 'completed'
  // Vendors can only update bookings assigned to them.
};

export {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
import { MaintenanceRequest } from '../models/maintenanceRequest.model.js';

const createMaintenanceRequest = async (req, res) => {
  try {
    const {
      service,
      plan,
      date,
      time,
      address,
      city,
      zip,
      notes,
      vendor
    } = req.body;

    const newRequest = new MaintenanceRequest({
      service,
      plan,
      date,
      time,
      address,
      city,
      zip,
      notes,
      vendor,

      // 🔥 IMPORTANT
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'Request received',
      data: newRequest
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET ALL REQUESTS
const getAllRequests = async (req, res) => {
  try {
    let filter = {};

    // If logged in as a vendor, only show requests assigned to them
    if (req.activeRole === 'vendor') {
      filter.vendor = req.user._id;
    }

    const requests = await MaintenanceRequest.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// UPDATE REQUEST
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await MaintenanceRequest.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// DELETE REQUEST
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await MaintenanceRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({
      success: true,
      message: 'Request deleted'
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export { createMaintenanceRequest, getAllRequests, updateRequest, deleteRequest };
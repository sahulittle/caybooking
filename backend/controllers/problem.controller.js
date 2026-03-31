
import { ProblemRequest } from '../models/problem.model.js';

// CREATE REQUEST
export const problemRequest = async (req, res) => {
  try {
    const newRequest = await ProblemRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      data: newRequest
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// GET ALL REQUESTS (ADMIN)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await ProblemRequest.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};


// UPDATE STATUS / ASSIGN VENDOR
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await ProblemRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};


// DELETE REQUEST
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await ProblemRequest.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Request deleted'
    });

  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};
import Service from '../models/service.model.js';

// Public - list services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('vendor', 'name email businessName');
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    console.error('Get Services Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public - get service by id
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('vendor', 'businessName');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    console.error('Get Service Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Private - vendor creates service
const createService = async (req, res) => {
  try {
    // Only vendors can create services
    if (!req.user || !req.user.roles.includes('vendor')) {
      return res.status(403).json({ success: false, message: 'Only vendors can create services' });
    }

    const { title, description, category, plans } = req.body;
    let imageUrl = req.body.image || null;
    if (req.file) {
      // store relative path for client access via /uploads
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newService = await Service.create({
      title,
      description,
      image: imageUrl,
      category,
      plans,
      vendor: req.user._id
    });

    res.status(201).json({ success: true, message: 'Service created', service: newService });
  } catch (error) {
    console.error('Create Service Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Private - vendor/admin update
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    // Only owner vendor or admin
    if (req.user._id.toString() !== service.vendor?.toString() && req.activeRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // If file uploaded, set image path
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    Object.assign(service, req.body);
    await service.save();

    res.json({ success: true, message: 'Service updated', service });
  } catch (error) {
    console.error('Update Service Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin - delete
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    console.error('Delete Service Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllServices, getServiceById, createService, updateService, deleteService };

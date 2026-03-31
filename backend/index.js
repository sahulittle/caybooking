import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import vendorRoutes from './routes/vendor.routes.js'; 
import adminRoutes from './routes/admin.routes.js';
import maintenanceRequestRoutes from './routes/maintenanceRequest.routes.js';


// Load environment variables
dotenv.config();

//connection db
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON payloads

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Cayman Maintenance API is running' });
});

// API Routes
app.use('/api', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/maintenance-request', maintenanceRequestRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
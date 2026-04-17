import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import maintenanceRequestRoutes from './routes/maintenanceRequest.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import servicesRoutes from './routes/services.routes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import paymentRoutes from './routes/payment.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';



// Load environment variables
dotenv.config();

//connection db
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON payloads
// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Cayman Maintenance API is running' });
});

// API Routes
app.use('/api', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/maintenance-request', maintenanceRequestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use("/api/payments", paymentRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Make io available to controllers via app.locals
app.locals.io = io;

io.on('connection', (socket) => {
  console.log('🔌 New socket connection:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
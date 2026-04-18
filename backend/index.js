import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import maintenanceRequestRoutes from "./routes/maintenanceRequest.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

// Load environment variables
dotenv.config();

// Connect DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   ✅ FIXED CORS CONFIG
========================= */
const allowedOrigins = [
  "https://caybookme.online",
  "http://localhost:5173", // for local dev (optional)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps / Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(
          new Error("CORS not allowed for this origin: " + origin),
        );
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// 🔥 IMPORTANT: handle preflight
app.options("*", cors());

/* =========================
   OTHER MIDDLEWARE
========================= */
app.use(express.json());

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Cayman Maintenance API is running" });
});

/* =========================
   ROUTES
========================= */
app.use("/api", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/maintenance-request", maintenanceRequestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);

/* =========================
   SOCKET.IO
========================= */
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io available globally
app.locals.io = io;

io.on("connection", (socket) => {
  console.log("🔌 New socket connection:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* =========================
   START SERVER
========================= */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

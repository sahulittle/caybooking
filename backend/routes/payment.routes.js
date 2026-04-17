import express from "express";
import Stripe from "stripe";
import Booking from "../models/booking.model.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ RAW BODY REQUIRED
router.post(
  "/create-checkout-session",
  protect,
  express.json(),
  createCheckoutSession
);

// Stripe webhook (raw body required)
// NOTE: keep webhook defined after the JSON route to avoid body-parser conflicts
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook Error:", err.message);
      return res.sendStatus(400);
    }

    // ✅ PAYMENT SUCCESS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata.bookingId;

      const booking = await Booking.findById(bookingId);

      if (booking) {
        booking.status = "confirmed";
        // store payment details
        booking.payment = {
          paid: true,
          transactionId: session.payment_intent,
          amount: session.amount_total ? session.amount_total / 100 : undefined,
          currency: session.currency || 'usd',
          method: 'stripe'
        };

        await booking.save();

        // 🔥 SOCKET EMIT
        const io = req.app.locals.io;

        if (io) {
          io.to(`user_${booking.user}`).emit("paymentSuccess", booking);
          io.to(`vendor_${booking.vendor}`).emit("newPaidBooking", booking);
        }
      }
    }

    res.json({ received: true });
  }
);

export default router;
import Stripe from "stripe";
import Booking from "../models/booking.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ CREATE CHECKOUT SESSION
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ensure the requesting user owns the booking
    if (req.user && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this booking" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.service.title,
            },
            unit_amount: booking.plan.price * 100,
          },
          quantity: 1,
        },
      ],

      // After successful payment redirect user to home page
      success_url: `${process.env.CLIENT_URL}/`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancel`,

      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    res.json({ url: session.url });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
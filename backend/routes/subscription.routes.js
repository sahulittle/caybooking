import express from 'express'
import { getAllPlans, getPlanById, createSubscriptionCheckout } from '../controllers/subscription.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public
router.get('/', getAllPlans)
router.get('/:id', getPlanById)

// Create Stripe Checkout Session for subscriptions (vendor/user)
router.post('/create-checkout-session', protect, express.json(), createSubscriptionCheckout)

export default router

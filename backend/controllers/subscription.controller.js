import SubscriptionPlan from '../models/subscription.model.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Public - list all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ createdAt: -1 })
    res.json({ success: true, plans })
  } catch (err) {
    console.error('Get Plans Error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Public - get by id
const getPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id)
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' })
    res.json({ success: true, plan })
  } catch (err) {
    console.error('Get Plan Error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Admin - create plan
const createPlan = async (req, res) => {
  try {
    const { name, price = 0, duration = '', description = '', features = [], highlight = false, popular = false, isGold = false } = req.body
    const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features
    const plan = await SubscriptionPlan.create({ name, price: Number(price), duration, description, features: parsedFeatures, highlight, popular, isGold })
    res.status(201).json({ success: true, plan })
  } catch (err) {
    console.error('Create Plan Error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Admin - update
const updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id)
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' })
    const { features } = req.body
    if (features && typeof features === 'string') req.body.features = JSON.parse(features)
    Object.assign(plan, req.body)
    await plan.save()
    res.json({ success: true, plan })
  } catch (err) {
    console.error('Update Plan Error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Admin - delete
const deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id)
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' })
    await plan.deleteOne()
    res.json({ success: true, message: 'Plan deleted' })
  } catch (err) {
    console.error('Delete Plan Error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

export { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan }

// Create a Checkout Session for subscribing to a plan
export const createSubscriptionCheckout = async (req, res) => {
  try {
    const { planId } = req.body
    const plan = await SubscriptionPlan.findById(planId)
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' })

    if (!plan.price || Number(plan.price) <= 0) {
      return res.status(400).json({ success: false, message: 'Free plans cannot be processed via Stripe' })
    }

    // determine interval from duration string (simple heuristic)
    let interval = 'month'
    if (plan.duration && String(plan.duration).toLowerCase().includes('year')) interval = 'year'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: plan.name, description: plan.description },
            recurring: { interval },
            unit_amount: Math.round(Number(plan.price) * 100),
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          planId: plan._id.toString(),
          userId: req.user ? req.user._id.toString() : undefined,
        },
      },
      success_url: `${process.env.CLIENT_URL}/vendor/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/vendor/subscription-cancel`,
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('Create subscription checkout error', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

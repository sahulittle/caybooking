import React, { useState } from 'react'
import Sidebar from '../Sidebar'
import { Check, Zap, Crown, Star, Shield, ArrowRight, X, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [processing, setProcessing] = useState(false)

  const plans = [
    {
      id: 1,
      name: 'Free Trial',
      duration: '3 Days',
      price: '0',
      description: 'Start your journey with zero risk.',
      features: [
        'Access to Dashboard',
        'Receive up to 2 Leads',
        'Basic Profile',
        'Email Support'
      ],
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      highlight: false,
      btnText: 'Start Free Trial',
      color: 'border-gray-200',
      buttonStyle: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
    },
    {
      id: 2,
      name: 'Pro Monthly',
      duration: '1 Month',
      price: '49',
      description: 'Everything you need to grow.',
      features: [
        'Unlimited Leads',
        'Verified Vendor Badge',
        'Priority Support',
        'Advanced Analytics',
        'Instant Notifications'
      ],
      icon: <Star className="w-6 h-6 text-white" />,
      highlight: true,
      popular: true,
      btnText: 'Subscribe Now',
      color: 'border-blue-500 ring-1 ring-blue-500',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
    },
    {
      id: 3,
      name: 'Gold Membership',
      duration: '4 Months',
      price: '179',
      description: 'Maximum power & visibility.',
      features: [
        'All Pro Features',
        'Featured Listing (Top Rank)',
        '0% Commission on first 5 jobs',
        'Dedicated Account Manager',
        'Premium Profile Frame'
      ],
      icon: <Crown className="w-6 h-6 text-amber-100" />,
      highlight: false,
      isGold: true,
      btnText: 'Get Gold',
      color: 'border-amber-200',
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-orange-200'
    }
  ]

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  const handlePayment = () => {
    setProcessing(true)
    // Simulate API call for payment processing
    setTimeout(() => {
      setProcessing(false)
      setShowPaymentModal(false)
      toast.success(`Successfully subscribed to ${selectedPlan.name}!`)
    }, 2000)
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      {/* Added lg:ml-64 to push content when sidebar is fixed on large screens */}
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 transition-all lg:ml-58">
        <div className="w-full mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-bold tracking-wide uppercase text-sm bg-blue-50 px-3 py-1 rounded-full">Pricing Plans</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-4 mb-4">Choose the Right Plan for Your Business</h1>
            <p className="text-xl text-gray-500">
              Unlock the full potential of CaymanMaintenance with our flexible subscription options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${plan.color} ${plan.isGold ? 'bg-gradient-to-b from-amber-50/50 to-white' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                    Most Popular
                  </div>
                )}
                {plan.isGold && (
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                     <Crown className="w-3 h-3" /> Best Value
                   </div>
                )}

                <div className="mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${plan.isGold ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : plan.popular ? 'bg-blue-600' : 'bg-blue-50'}`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 mt-2 text-sm h-10">{plan.description}</p>
                </div>

                <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    {plan.price !== '0' && <span className="text-gray-500 font-medium">/{plan.duration}</span>}
                  </div>
                  {plan.id === 1 && <span className="text-sm text-gray-500 font-medium">No credit card required</span>}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 p-0.5 rounded-full ${plan.isGold ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-gray-600 text-sm font-medium leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.buttonStyle}`}
                >
                  {plan.btnText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-indigo-200 p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-full text-green-600"><Shield className="w-6 h-6" /></div>
                <div>
                   <h4 className="font-bold text-gray-900">Secure Payment</h4>
                   <p className="text-xs text-gray-500">256-bit SSL Encryption</p>
                </div>
             </div>
             <div className="bg-indigo-200 p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Check className="w-6 h-6" /></div>
                <div>
                   <h4 className="font-bold text-gray-900">Cancel Anytime</h4>
                   <p className="text-xs text-gray-500">No hidden fees or contracts</p>
                </div>
             </div>
             <div className="bg-indigo-200 p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-full text-purple-600"><Star className="w-6 h-6" /></div>
                <div>
                   <h4 className="font-bold text-gray-900">Top Rated Support</h4>
                   <p className="text-xs text-gray-500">24/7 Priority assistance</p>
                </div>
             </div>
          </div>

        </div>

        {/* Payment Confirmation Modal */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {selectedPlan.icon}
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900">{selectedPlan.name}</h4>
                      <p className="text-sm text-gray-500">{selectedPlan.duration} Access</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${selectedPlan.price}</span>
                   </div>
                   <div className="flex justify-between text-gray-600">
                      <span>Tax (0%)</span>
                      <span>$0.00</span>
                   </div>
                   <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-900">Total Due</span>
                      <span className="font-bold text-2xl text-blue-600">${selectedPlan.price}</span>
                   </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : (
                    <><CreditCard className="w-5 h-5" /> Pay Now</>
                  )}
                </button>
                
                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Secure 256-bit SSL Encrypted Payment
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Subscription
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CalendarDays, Clock, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, ShieldCheck } from "lucide-react";
import { allServicesData } from "./servicesData"; // Assuming this exists based on BookingPage.jsx

const WeeklyBookingPage = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(allServicesData[0]);
  const [selectedPlan, setSelectedPlan] = useState(allServicesData[0].plans[0]);
  
  const [formData, setFormData] = useState({
    selectedDays: ["Monday"],
    time: "10:00 AM",
    address: "",
    city: "",
    zip: "",
    notes: "",
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleServiceChange = (e) => {
    const service = allServicesData.find(s => s.id === parseInt(e.target.value));
    setSelectedService(service);
    setSelectedPlan(service.plans[0]);
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const isSelected = prev.selectedDays.includes(day);
      const newDays = isSelected
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day];
      return { ...prev, selectedDays: newDays };
    });
  };

  const subtotal = selectedPlan.price * formData.selectedDays.length;
  const discount = subtotal * 0.15; // 15% Subscription Discount
  const serviceFee = 5.0;
  const total = subtotal - discount + serviceFee;

  const handleConfirm = () => {
    toast.success("Weekly subscription started successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header UI */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest mb-4 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" /> Recurring Maintenance
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Weekly Routine</h1>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">Set it and forget it. Your favorite professional, every week, at a discounted rate.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form Flow (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Custom Step Indicator */}
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all ${
                    currentStep >= step ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step}
                  </div>
                  <span className={`hidden sm:block text-sm font-bold uppercase tracking-tight ${currentStep >= step ? "text-gray-900" : "text-gray-400"}`}>
                    {step === 1 ? "Service" : step === 2 ? "Schedule" : "Confirm"}
                  </span>
                  {step < 3 && <div className="hidden sm:block w-12 h-px bg-gray-200 mx-2"></div>}
                </div>
              ))}
            </div>

            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <CheckCircle2 className="text-indigo-600" /> Select your service
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Available Services</label>
                    <select 
                      onChange={handleServiceChange}
                      className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:ring-0 transition-all font-bold text-gray-800"
                    >
                      {allServicesData.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    {selectedService.plans.map((plan) => (
                      <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                          selectedPlan.id === plan.id 
                          ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50" 
                          : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <h4 className="font-black text-lg text-gray-900">{plan.name}</h4>
                        <p className="text-2xl font-black text-indigo-600 my-2">${plan.price}<span className="text-sm text-gray-400 font-bold">/visit</span></p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{plan.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all group"
                  >
                    Next Step <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Schedule (Weekly) */}
            {currentStep === 2 && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <Clock className="text-indigo-600" /> Pick your weekly slot
                </h2>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Preferred Days (Select multiple)</label>
                    <div className="flex flex-wrap gap-3">
                      {days.map(day => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                            formData.selectedDays.includes(day) 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Arrival Window</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setFormData({...formData, time: time})}
                          className={`py-3 rounded-xl font-bold text-xs transition-all border-2 ${
                            formData.time === time 
                            ? "bg-indigo-600 border-indigo-600 text-white" 
                            : "bg-white border-gray-100 text-gray-500"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">City</label>
                      <input 
                        type="text" 
                        placeholder="George Town"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 outline-none"
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Full Address</label>
                      <input 
                        type="text" 
                        placeholder="Street, Building, Apt"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 outline-none"
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    onClick={() => {
                      if (formData.selectedDays.length === 0) {
                        toast.error("Please select at least one day");
                        return;
                      }
                      setCurrentStep(3);
                    }}
                    className="flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all group"
                  >
                    Final Review <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <ShieldCheck className="text-indigo-600" /> Review your subscription
                </h2>

                <div className="bg-indigo-50/50 rounded-[2rem] p-8 border border-indigo-100 space-y-6">
                  <div className="flex justify-between items-center border-b border-indigo-100 pb-6">
                    <div>
                      <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Service & Frequency</p>
                      <h4 className="text-xl font-black text-gray-900">{selectedService.title}</h4>
                      <p className="text-sm font-bold text-gray-500 mt-1">Every {formData.selectedDays.join(", ")} at {formData.time}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm border border-indigo-100">WEEKLY</span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Service Location</p>
                      <p className="text-sm font-bold text-gray-800">{formData.address || "Main Street, Apt 4"}, {formData.city || "George Town"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <p className="text-sm font-medium text-yellow-800">You can pause or cancel your subscription anytime from your dashboard. Next billing occurs after the first visit.</p>
                </div>

                <div className="mt-12 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    onClick={handleConfirm}
                    className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                  >
                    Activate Subscription
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Summary (4/12) */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sticky top-28 shadow-2xl overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-xl font-black mb-8 pb-4 border-b border-white/10">Pricing Summary</h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold text-sm">
                    {formData.selectedDays.length}x Weekly {selectedPlan.name}
                  </span>
                  <span className="font-black">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-emerald-400 bg-emerald-400/10 p-3 rounded-xl border border-emerald-400/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-black text-xs uppercase">Subscription Discount</span>
                  </div>
                  <span className="font-black">-${discount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold text-sm">Service Fee</span>
                  <span className="font-black">${serviceFee.toFixed(2)}</span>
                </div>

                <div className="h-px bg-white/10 my-4"></div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Weekly Total</p>
                    <p className="text-4xl font-black">${total.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase">Save $124/year</p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 leading-tight">Identity verified & background checked professionals.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 leading-tight">Same professional every visit for consistency.</p>
                </div>
              </div>
            </div>

            {/* Cancel Info */}
            <div className="mt-6 p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h5 className="text-xs font-black text-gray-900 uppercase">Cancel Anytime</h5>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">No long-term contracts. Pause or stop your routine with one tap.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WeeklyBookingPage;
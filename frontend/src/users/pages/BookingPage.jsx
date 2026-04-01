import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { allServicesData } from "./servicesData";
import { bookingAPI } from "../../api/apiClient";

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize with location state or fallback mock data
  const [bookingData, setBookingData] = useState(() => {
    if (location.state) return location.state;
    // Fallback default
    const defaultService = allServicesData[0];
    return {
      service: defaultService,
      plan: defaultService.plans[0],
    };
  });

  const { service, plan } = bookingData;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    address: "",
    city: "",
    zip: "",
    notes: "",
  });

  // const payload = {
  //   service,
  //   plan,
  //   date,
  //   time,
  //   address,
  //   city,
  //   zip,
  //   notes
  // },

  const payload = {
    service: service.title,
    plan: plan.name,
    date: formData.date,
    time: formData.time,
    address: formData.address,
    city: formData.city,
    zip: formData.zip,
    notes: formData.notes,
    status: "Pending",
    price: plan.price,
  };
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { id: 1, title: "Schedule", icon: "📅" },
    { id: 2, title: "Details", icon: "📍" },
    { id: 3, title: "Confirm", icon: "✅" },
  ];

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const serviceId = parseInt(e.target.value);
    const selectedService = allServicesData.find((s) => s.id === serviceId);
    if (selectedService) {
      setBookingData({
        service: selectedService,
        plan: selectedService.plans[0], // Default to first plan of new service
      });
    }
  };

  const handlePlanChange = (e) => {
    const planId = parseInt(e.target.value);
    const selectedPlan = bookingData.service.plans.find((p) => p.id === planId);
    if (selectedPlan) {
      setBookingData((prev) => ({ ...prev, plan: selectedPlan }));
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.date && formData.time;
    if (currentStep === 2)
      return formData.address && formData.city && formData.zip;
    return true;
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirm = async () => {
    if (
      !formData.date ||
      !formData.time ||
      !formData.address ||
      !formData.city ||
      !formData.zip
    ) {
      toast.error("Please complete booking details before confirming.");
      return;
    }

    const payload = {
      service: service.title,
      plan: plan.name,
      date: formData.date,
      time: formData.time,
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      notes: formData.notes,
    };

    try {
      // Map frontend fields to backend expected names
      const body = {
        serviceTitle: service.title,
        planName: plan.name,
        bookingDate: formData.date,
        bookingTime: formData.time,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        notes: formData.notes,
      };

      const res = await bookingAPI.createBooking(body);
      if (res.data && res.data.success) {
        toast.success("Booking confirmed!");
        navigate("/");
      } else {
        toast.error(res.data?.message || "Unable to submit booking.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to submit booking. Please try again.",
      );
    }
  };

  // Calculate totals
  const serviceFee = 5.0;
  const subtotal = plan.price || 0;
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/service"
            className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - STEPS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Steps Indicator */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 rounded-full"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                ></div>

                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center gap-2 bg-white px-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                        currentStep >= step.id
                          ? "bg-blue-600 border-blue-600 text-white shadow-md scale-110"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {currentStep > step.id ? "✓" : step.id}
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${currentStep >= step.id ? "text-blue-600" : "text-gray-400"}`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* STEP 1: SCHEDULE */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">📅</span> Select Date & Time
                  </h2>

                  {/* Service & Plan Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Service
                      </label>
                      <div className="relative">
                        <select
                          value={service.id}
                          onChange={handleServiceChange}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 appearance-none pr-10"
                        >
                          {allServicesData.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Plan
                      </label>
                      <div className="relative">
                        <select
                          value={plan.id}
                          onChange={handlePlanChange}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 appearance-none pr-10"
                        >
                          {service.plans &&
                            service.plans.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} - ${p.price}
                              </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Pick a Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, time: slot }))
                          }
                          className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                            formData.time === slot
                              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                              : "border-gray-100 hover:border-blue-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">📍</span> Service Location
                  </h2>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="123 Main St, Apt 4B"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="George Town"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Zip / Postal Code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        placeholder="KY1-1234"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows="3"
                      placeholder="Gate code, parking instructions, or specific requests..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 resize-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">✅</span> Review & Confirm
                  </h2>

                  <div className="bg-blue-50 rounded-xl p-6 space-y-4 border border-blue-100">
                    <div className="flex gap-4 items-start">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-xl">
                        📅
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Date & Time</h4>
                        <p className="text-gray-600">
                          {formData.date} at {formData.time}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-blue-200/50"></div>

                    <div className="flex gap-4 items-start">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-xl">
                        📍
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Location</h4>
                        <p className="text-gray-600">{formData.address}</p>
                        <p className="text-gray-600">
                          {formData.city}, {formData.zip}
                        </p>
                      </div>
                    </div>

                    {formData.notes && (
                      <>
                        <div className="h-px bg-blue-200/50"></div>
                        <div className="flex gap-4 items-start">
                          <div className="bg-white p-2 rounded-lg shadow-sm text-xl">
                            📝
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Notes</h4>
                            <p className="text-gray-600 text-sm italic">
                              "{formData.notes}"
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                      defaultChecked
                    />
                    <label htmlFor="terms">
                      I agree to the{" "}
                      <span className="text-blue-600 cursor-pointer hover:underline">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-blue-600 cursor-pointer hover:underline">
                        Privacy Policy
                      </span>
                      .
                    </label>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-8 mt-4 border-t border-gray-100">
                {currentStep > 1 ? (
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div></div> /* Spacer */
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform hover:-translate-y-0.5 shadow-lg ${
                      isStepValid()
                        ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                        : "bg-gray-300 cursor-not-allowed shadow-none"
                    }`}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleConfirm}
                    className="px-8 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-green-200"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-28">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Order Summary
              </h3>

              <div className="flex gap-4 mb-6">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-20 h-20 rounded-lg object-cover shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {service.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{plan.name}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-amber-500 text-xs">★</span>
                    <span className="text-xs font-bold text-gray-700">
                      {service.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({service.reviews})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="font-medium text-gray-900">
                    ${serviceFee.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p>Free cancellation up to 24 hours before the appointment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { servicesAPI } from "../../api/apiClient";

const ServicesDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleBookNow = () => {
    // Pre-fill the booking page with the current service and selected plan (or default to first plan)
    const planToBook = selectedPlan || service.plans[0];
    const user = localStorage.getItem("user");
    if (!user) {
      // send to login and resume booking after auth
      navigate("/login", {
        state: {
          resumeBooking: { service, plan: planToBook },
          from: { pathname: "/bookingpage" },
        },
      });
      return;
    }

    navigate("/bookingpage", { state: { service, plan: planToBook } });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [service, setService] = React.useState(null);

  React.useEffect(() => {
    servicesAPI
      .getById(serviceId)
      .then((res) => setService(res.data.service))
      .catch((err) => console.error(err));
  }, [serviceId]);

  if (!service) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <Link
          to="/service"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Go back to services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans pt-5 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/service"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
          >
            &larr; Back to Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Banner & Title Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="h-64 sm:h-80 w-full relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white w-full">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    {service.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm sm:text-base">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                      {service.rating} ★
                    </span>
                    <span className="opacity-90">
                      {service.reviews} verified reviews
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  About the Service
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            {/* 4. Pricing Options (Cards) */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Select a Service Plan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`cursor-pointer rounded-xl p-5 border-2 transition-all duration-200 relative ${
                      selectedPlan?.id === plan.id
                        ? "border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {plan.name}
                    </h3>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ${plan.price}
                    </div>
                    <p className="text-gray-500 text-sm leading-snug">
                      {plan.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. What's Included */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                What's Included
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Customer Reviews */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Customer Reviews
              </h2>
              <div className="space-y-6">
                {service.customerReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {review.user}
                          </h4>
                          <div className="text-yellow-400 text-sm flex gap-0.5">
                            {"★".repeat(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Verified</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Right Sticky Sidebar (Booking Box) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-28">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Booking Summary
              </h3>

              {!selectedPlan ? (
                <div className="text-center py-10 px-4 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-sm">
                    Please select a service plan from the left to proceed with
                    booking.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {selectedPlan.name}
                      </p>
                      <p className="text-xs text-gray-500">Selected Plan</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ${selectedPlan.price}
                    </p>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Service Fee</span>
                    <span className="font-medium text-gray-900 text-sm">
                      $5.00
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-extrabold text-blue-600">
                      ${selectedPlan.price + 5}
                    </span>
                  </div>

                  <button
                    onClick={handleBookNow}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 mt-6 text-lg"
                  >
                    Book Now
                  </button>

                  <p className="text-xs text-center text-gray-400 mt-3 flex justify-center items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                    Secure checkout
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    Verified Pros
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    24/7 Support
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full mt-6 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg"
              >
                Instant Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesDetails;

// BookingSuccess.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bookingAPI } from "../../api/apiClient";

const BookingSuccess = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await bookingAPI.getBookingById(id);
        setBooking(res.data.booking);
      } catch (error) {
        console.error("Fetch booking error:", error);

        // ❌ Prevent crash
        if (error.response?.status === 401) {
          console.log("Unauthorized but staying on success page");
        }
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        🎉 Booking Confirmed!
      </h1>

      <p className="mt-4">Service: {booking.service.title}</p>
      <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p>Time: {booking.bookingTime}</p>
      <p>Status: {booking.status}</p>
    </div>
  );
};

export default BookingSuccess;

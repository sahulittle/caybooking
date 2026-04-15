import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicesAPI } from "../../api/apiClient";

const ServicesByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesAPI.getServicesByCategory(categoryId);
        setServices(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
  }, [categoryId]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Services</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            onClick={() => {
              const user = localStorage.getItem("user");
              // If not logged in, send to login and preserve intended booking
              if (!user) {
                navigate("/login", {
                  state: {
                    from: { pathname: "/bookingpage" },
                    resumeBooking: { service, plan: service.plans?.[0] },
                  },
                });
                return;
              }

              navigate("/bookingpage", {
                state: {
                  service: service,
                  plan: service.plans?.[0],
                },
              });
            }}
            className="border p-4 rounded-xl shadow cursor-pointer hover:shadow-lg"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="font-bold mt-3">{service.title}</h3>
            <p className="text-sm text-gray-500">
              ₹{service.plans?.[0]?.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesByCategory;

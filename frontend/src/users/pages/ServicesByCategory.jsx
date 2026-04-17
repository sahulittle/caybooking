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

        console.log("SERVICES DATA:", res.data.data);

        setServices(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
  }, [categoryId]);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Services</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            onClick={() => {
              const user = localStorage.getItem("user");

              if (!user) {
                navigate("/login", {
                  state: {
                    from: { pathname: "/bookingpage" },
                    resumeBooking: {
                      service,
                      plan: service.plans?.[0],
                    },
                  },
                });
                return;
              }

              navigate("/bookingpage", {
                state: {
                  service,
                  plan: service.plans?.[0],
                },
              });
            }}
            className="border p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition duration-300"
          >
            {/* ✅ FINAL IMAGE FIX */}
            <img
              src={
                service.image ||
                service.category?.image ||
                "https://dummyimage.com/300x200/cccccc/000000&text=No+Image"
              }
              alt={service.title}
              className="w-full h-44 object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
              }}
            />

            <h3 className="font-bold mt-3 text-lg">{service.title}</h3>

            <p className="text-xs text-gray-400">
              {service.category?.addCategory}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              ₹{service.plans?.[0]?.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesByCategory;

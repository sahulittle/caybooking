import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Snowflake,
  Sparkles,
  Droplet,
  Zap,
  Bug,
  Wrench,
  Paintbrush,
  Leaf,
  Star,
  Bed,
  UserRound,
  Activity,
} from "lucide-react";

const Service = () => {
  const navigate = useNavigate();

  const [services, setServices] = React.useState([]);
  const [loadingServices, setLoadingServices] = React.useState(true);
  React.useEffect(() => {
    import("../../api/apiClient").then(({ servicesAPI }) => {
      servicesAPI
        .getAll()
        .then((res) => {
          setServices(
            (res.data.services || []).map((s, i) => ({
              id: s._id,
              name: s.title || s.name,
              description: s.description,
              price: s.plans?.[0]?.price || 0,
              rating: s.rating || 4.5,
              category: s.category || "General",
              image: s.image,
            })),
          );
        })
        .catch((err) => console.error("Failed to load services", err))
        .finally(() => setLoadingServices(false));
    });
  }, []);

  const [price, setPrice] = useState(300);

  const filteredServices = services.filter((service) => service.price <= price);

  return (
    <div className="bg-gray-50 min-h-screen pb-16 font-sans">
      <div className="bg-[radial-gradient(circle_at_top_right,#374151_0%,#111827_100%)] text-white py-16 px-8 text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2">
          Our Professional Services
        </h1>
        <p className="text-gray-400 text-lg">
          Find the right expert for your home needs
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap gap-8 px-8">
        {/* Sidebar Filters */}
        <aside className="flex-1 min-w-[250px] bg-white p-6 rounded-2xl h-fit shadow-sm">
          <div className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Category</h3>
            {[
              "Cooling",
              "Cleaning",
              "Plumbing",
              "Electrical",
              "Repair",
              "Renovation",
              "Outdoor",
              "Healthcare",
            ].map((cat) => (
              <label
                key={cat}
                className="flex items-center mb-3 text-gray-600 text-[0.95rem] cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-3 accent-blue-600 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />{" "}
                {cat}
              </label>
            ))}
          </div>

          <div className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Price Range
            </h3>
            <input
              type="range"
              min="0"
              max="300"
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$0</span>
              <span>
                ${price}
                {Number(price) === 300 ? "+" : ""}
              </span>
            </div>
          </div>

          <div className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Rating</h3>
            {[5, 4, 3].map((star) => (
              <label
                key={star}
                className="flex items-center mb-3 text-gray-600 text-[0.95rem] cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-3 accent-blue-600 w-4 h-4"
                />
                <span className="flex items-center text-amber-400 ml-1 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < star ? "fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </span>
                <span className="ml-1">& Up</span>
              </label>
            ))}
          </div>

          <div className="mb-8 border-b border-gray-200 pb-6 last:border-0 last:mb-0 last:pb-0">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Availability
            </h3>
            <label className="flex items-center mb-3 text-gray-600 text-[0.95rem] cursor-pointer">
              <input type="checkbox" className="mr-3 accent-blue-600 w-4 h-4" />{" "}
              Available Today
            </label>
            <label className="flex items-center mb-3 text-gray-600 text-[0.95rem] cursor-pointer">
              <input type="checkbox" className="mr-3 accent-blue-600 w-4 h-4" />{" "}
              Available This Weekend
            </label>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-[3] grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 shadow-sm flex flex-col border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                {service.icon}
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {service.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-500 text-[0.95rem] mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="flex justify-between items-center mb-6 mt-auto">
                <div className="font-semibold text-gray-700 flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />{" "}
                  {service.rating}
                </div>
                <div className="text-sm text-gray-500">
                  From{" "}
                  <span className="text-xl font-bold text-gray-900">
                    ${service.price}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/service/${service.id}`)}
                className="w-full py-3.5 bg-blue-600 text-white border-none rounded-xl font-semibold cursor-pointer text-base transition-colors duration-200 hover:bg-blue-700"
              >
                Book Now
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Service;

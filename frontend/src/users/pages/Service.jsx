import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star } from "lucide-react";

const Service = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [availableToday, setAvailableToday] = useState(false);
  const [price, setPrice] = useState(300);
  const [showAll, setShowAll] = useState(false);

  const loadCategories = async () => {
    try {
      const { servicesAPI } = await import("../../api/apiClient");
      const res = await servicesAPI.getCategories();
      setCategories(
        (res.data?.data || []).map((cat) => {
          // Derive a safe display name string — backend may return nested objects
          let displayName = "General";
          if (typeof cat.name === "string" && cat.name.trim())
            displayName = cat.name;
          else if (
            typeof cat.addCategory === "string" &&
            cat.addCategory.trim()
          )
            displayName = cat.addCategory;
          else if (cat.name && typeof cat.name === "object") {
            displayName =
              cat.name.addCategory || cat.name.name || JSON.stringify(cat.name);
          }
          return { ...cat, displayName };
        }),
      );
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const loadServices = async (overrideCategory = null) => {
    setLoadingServices(true);
    try {
      const { servicesAPI } = await import("../../api/apiClient");

      // prefer explicit override, then selected single category
      const categoryToUse =
        overrideCategory ||
        (selectedCategories.length === 1 ? selectedCategories[0] : null);

      const params = {};
      if (categoryToUse) params.category = categoryToUse;
      if (price) params.maxPrice = price;
      if (minRating) params.minRating = minRating;
      if (availableToday) params.availableNow = true;

      let res;
      if (categoryToUse) {
        // if a specific category, use category API if available
        try {
          res = await servicesAPI.getServicesByCategory(categoryToUse);
          const items = (res.data?.data || []).map(mapService);
          setServices(items);
        } catch (e) {
          // fallback to general list
          res = await servicesAPI.getAll(params);
          setServices((res.data?.services || []).map(mapService));
        }
      } else {
        res = await servicesAPI.getAll(params);
        setServices((res.data?.services || []).map(mapService));
      }
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const mapService = (s) => ({
    id: s._id,
    name: s.title || s.name,
    description: s.description,
    price: s.plans?.[0]?.price || 0,
    rating: s.rating || 4.5,
    // derive a safe category string to avoid rendering objects
    category:
      (typeof s.category === "string" && s.category) ||
      s.category?.name ||
      s.category?.addCategory ||
      "General",
    image: s.image,
    raw: s,
  });

  useEffect(() => {
    const incoming = location.state?.servicesList;
    if (incoming && incoming.length) {
      setServices(incoming.map(mapService));
      setLoadingServices(false);
      loadCategories();
      return;
    }

    loadCategories();
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // reload when filters change
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, price, minRating, availableToday]);

  const filteredServices = services.filter(
    (service) => service.price <= price && service.rating >= minRating,
  );

  const displayedServices = useMemo(() => {
    if ((selectedCategories && selectedCategories.length > 0) || showAll) {
      return filteredServices;
    }
    return filteredServices.slice(0, 5);
  }, [filteredServices, selectedCategories, showAll]);

  // Get the first selected category for display
  const selectedCategory = selectedCategories.length > 0 
    ? categories.find(cat => cat._id === selectedCategories[0])
    : null;

  return (
    <div className="bg-[#fbb040] min-h-screen pb-20 font-sans">
      
      {/* Hero Header */}
      <div className="bg-[radial-gradient(circle_at_top_right,#1e293b_0%,#0f172a_100%)] text-white py-20 px-8 text-center mb-12 shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {selectedCategory ? selectedCategory.displayName : 'How can we help you today?'}
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            {selectedCategory ? selectedCategory.description : 'Select a category to explore professional services near you.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap gap-8 px-8">
        {/* Sidebar Filters */}
        <aside className="flex-1 min-w-[250px] bg-white p-6 rounded-2xl h-fit shadow-sm">
          <div className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Category</h3>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex items-center mb-3 text-gray-600 text-[0.95rem] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat._id)}
                    onChange={(e) => {
                      const next = e.target.checked ? [cat._id] : [];
                      setSelectedCategories(next);
                    }}
                    className="mr-3 accent-blue-600 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {cat.displayName}
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-400">Loading categories...</p>
            )}
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
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
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
                  name="rating"
                  type="radio"
                  checked={minRating === star}
                  onChange={() => setMinRating(star)}
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
              <input
                type="checkbox"
                checked={availableToday}
                onChange={(e) => setAvailableToday(e.target.checked)}
                className="mr-3 accent-blue-600 w-4 h-4"
              />
              Available Today
            </label>
            <label className="flex items-center mb-3 text-gray-600 text-[0.95rem] cursor-pointer">
              <input type="checkbox" className="mr-3 accent-blue-600 w-4 h-4" />{" "}
              Available This Weekend
            </label>
            <div className="mt-4">
              <button
                onClick={() => setShowAll((s) => !s)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
              >
                {showAll ? "Show Less" : "Show All"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-[3] grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 shadow-sm flex flex-col border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
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
                <span className="text-lg font-bold text-gray-900">
                  ${service.price}
                </span>
              </div>

              <button
                onClick={() => {
                  const user = localStorage.getItem("user");
                  const planToBook = {
                    id: service.raw?.plans?.[0]?.id,
                    ...service.raw?.plans?.[0],
                  };
                  const serviceObj = service.raw || null;
                  if (!user) {
                    navigate("/login", {
                      state: {
                        resumeBooking: {
                          service: serviceObj,
                          plan: planToBook,
                        },
                        from: { pathname: "/bookingpage" },
                      },
                    });
                    return;
                  }

                  navigate("/bookingpage", {
                    state: { service: serviceObj, plan: planToBook },
                  });
                }}
                className="w-full py-3.5 bg-blue-600 text-white border-none rounded-xl font-semibold cursor-pointer text-base transition-colors duration-200 hover:bg-blue-700"
              >
                Book Now
              </button>
            </div>
          ))}
        </main>

        {/* Helper Footer */}
        {!selectedCategory && (
          <div className="mt-20 text-center p-12 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <h4 className="text-xl font-bold text-slate-800 mb-2">Can't find what you're looking for?</h4>
            <p className="text-slate-500 mb-6">Our experts handle hundreds of tasks daily. Tell us what you need.</p>
            <button onClick={() => navigate('/contact')} className="text-blue-600 font-bold hover:underline">Contact Support &rarr;</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Service;
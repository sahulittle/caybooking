import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import {
  Check,
  Star,
  Fan,
  Zap,
  Droplet,
  Home as HomeIcon,
  Snowflake,
  BrushCleaning,
  Wrench,
  Bug,
  Sparkles,
  CalendarDays,
  Clock,
} from "lucide-react";
import logo from '../../../public/logo-cayman2.png'
import { servicesAPI } from "../../api/apiClient";

// Reusable Icon components using Lucide
const CheckmarkIcon = () => <Check className="text-yellow-500 w-6 h-6 " />;
const StarIcon = () => <Star className="text-amber-400 w-4 h-4 fill-current" />;

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://assets.nobroker.in/nob-common/AC_Uninstallation_Installation_7_11zon.webp",
    "https://5.imimg.com/data5/SELLER/Default/2021/10/TX/CA/EW/37108416/professional-house-cleaning-services-500x500.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjEc9rc-jyiYmDOO8zsSfKo-sRZ8zruB2s5w&s",
    "https://dirtblaster.in/wp-content/uploads/2020/03/Painting-5.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV6bM0KWuY_1vnCdkC_PXcW9GMK3RmT6oydg&s",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await servicesAPI.getCategories();
        console.log("CATEGORIES:", res.data);

        const categories = res.data.data || [];

        // map API → UI format
        const formatted = categories.map((cat) => ({
          _id: cat._id, // ✅ IMPORTANT
          name: cat.name || cat.addCategory,
        }));

        setPopularServices(formatted);
      } catch (err) {
        console.error("❌ Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);
  const [popularServices, setPopularServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const howItWorksSteps = [
    {
      number: 1,
      title: "Choose Service",
      description:
        "Select the service you need from our wide range of options.",
    },
    {
      number: 2,
      title: "Book a Time",
      description: "Pick a convenient date and time that works for you.",
    },
    {
      number: 3,
      title: "Get It Done",
      description:
        "A verified professional will arrive on time and complete the job.",
    },
  ];

  const whyChooseUsPoints = [
    {
      title: "Verified Professionals",
      description:
        "We vet every professional to ensure you get the best and most reliable service.",
    },
    {
      title: "Transparent Pricing",
      description: "See the price upfront. No hidden fees, no surprises.",
    },
    {
      title: "Fast Service",
      description:
        "Book in minutes and get a professional at your door, often on the same day.",
    },
    {
      title: "Customer Support",
      description:
        "Our support team is here to help you every step of the way.",
    },
  ];

  const testimonials = [
    {
      review:
        "Caymantainane is a lifesaver! My AC broke down during a heatwave, and they had someone here within 2 hours. Fantastic service!",
      author: "Sarah J., George Town",
    },
    {
      review:
        "The booking process was so simple. The cleaner was professional and did an amazing job. My home has never been so clean!",
      author: "Mike D., West Bay",
    },
    {
      review:
        "I was impressed with the transparent pricing. I knew exactly what I was paying for. Highly recommend for any plumbing needs.",
      author: "Emily R., Bodden Town",
    },
  ];
  // ✅ ADD HERE 👇👇👇
  const iconMap = {
    "AC Repair": <Fan className="w-8 h-8 mx-auto text-blue-500" />,
    Electrician: <Zap className="w-8 h-8 mx-auto text-yellow-500" />,
    Plumbing: <Droplet className="w-8 h-8 mx-auto text-cyan-500" />,
    "Home Cleaning": <HomeIcon className="w-8 h-8 mx-auto text-green-500" />,
    "Appliance Repair": <Wrench className="w-8 h-8 mx-auto text-indigo-500" />,
    "Pest Control": <Bug className="w-8 h-8 mx-auto text-red-500" />,
  };
  return (
    <div className="font-sans text-gray-700 bg-white">
      {/* 1. Hero Section */}
      <section className="relative px-4 sm:px-8 pt-24 sm:pt-40 pb-32 sm:pb-48 text-center overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={img}
              alt="Hero Background"
              className="w-full h-full object-cover min-h-[260px] sm:min-h-[360px]"
            />
            <div className="absolute inset-0 backdrop-blur-[1px]"></div>
          </div>
        ))}
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 py-2 px-4 bg-white/90 backdrop-blur-md border border-indigo-100 rounded-full text-indigo-600 font-semibold text-sm mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" /> #1 Home Service Provider
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Book Trusted{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Home Services
            </span>{" "}
            in Minutes
          </h1>
          <p className="text-lg md:text-xl text-black mb-10 max-w-xl mx-auto font-semibold">
            From AC repair to home cleaning — we connect you with verified
            professionals near you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate("/bookingpage")}
              className="py-3 px-6 md:py-4 md:px-8 text-base rounded-full cursor-pointer font-semibold shadow-md transition-transform hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/50"
            >
              Book Now
            </button>
            <button
              onClick={() => navigate("/service")}
              className="py-3 px-6 md:py-4 md:px-8 text-base rounded-full cursor-pointer font-semibold shadow-md transition-transform hover:scale-105 bg-white text-gray-800"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* 2. Search Bar */}
      <section className="px-4 sm:px-8 bg-white -mt-14 relative z-10 flex justify-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-2xl shadow-xl w-full max-w-4xl border border-gray-100">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services (AC repair, plumber, etc.)"
            className="flex-[2] py-3 px-4 border border-gray-200 rounded-lg text-base outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Your Location"
            className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-base outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={async () => {
              try {
                const q = [searchTerm, searchLocation]
                  .filter(Boolean)
                  .join(" ");
                const res = await servicesAPI.getAll({
                  search: q,
                  page: 1,
                  limit: 50,
                });
                const services = res.data.services || [];
                if (!services.length) {
                  alert("No services found for your search");
                  return;
                }
                // navigate to Service page and pass fetched services so UI shows results immediately
                navigate("/service", { state: { servicesList: services } });
              } catch (err) {
                console.error("Search failed", err);
                alert("Search failed");
              }
            }}
            className="flex-shrink-0 rounded-lg py-3 px-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md transition-transform hover:scale-105"
          >
            Search
          </button>
        </div>
      </section>

      {/* 3. Popular Services */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-16">
          Popular Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 ">
          {popularServices.map((service) => {
            const iconComponent = iconMap[service.name] || <Sparkles />;

            return (
              <div
                key={service.name}
                onClick={async () => {
                  try {
                    const res = await servicesAPI.getServicesByCategory(
                      service._id,
                    );

                    const services = res.data.data;

                    if (!services.length) {
                      alert("No services found");
                      return;
                    }

                    navigate(`/services/${service._id}`);
                  } catch (err) {
                    console.error(err);
                    alert("Failed to load services");
                  }
                }}
                className="bg-white px-6 py-10 rounded-2xl text-center shadow-md cursor-pointer border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-4 flex justify-center">{iconComponent}</div>
                <p className="text-base md:text-lg font-bold text-gray-800">
                  {service.name}
                </p>
              </div>
            );
          })
          }
        </div >
      </section >

      {/* 4. How It Works */}
      <section className="py-24 px-8 max-w-7xl mx-auto bg-gray-50 rounded-2xl">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-16">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-around gap-8 text-center">
          {howItWorksSteps.map((step) => (
            <div key={step.number} className="flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-16">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUsPoints.map((point) => (
            <div
              key={point.title}
              className="bg-white p-8 rounded-xl text-center"
            >
              <div className="flex justify-center">
                <CheckmarkIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                {point.title}
              </h3>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>
      </section>


  {/* 6. Testimonials */}
  <section className="py-24 px-8 bg-indigo-50">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-16">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className="italic text-gray-600 mb-4">
              "{testimonial.review}"
            </p>
            <p className="font-semibold text-gray-900 text-right">
              - {testimonial.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* 7. CTA Section */}
  <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 px-8 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-8">
      Need help? Book a service now.
    </h2>
    <button
      onClick={() => navigate("/bookingpage")}
      className="py-4 px-10 text-lg rounded-full cursor-pointer font-bold shadow-lg transition-transform hover:scale-105 bg-white text-blue-600"
    >
      Book a Service
    </button>
  </section>

  {/* 8. Footer */}
  <footer className="bg-gray-900 text-gray-300 pt-16 px-8">
    <div className="max-w-7xl mx-auto flex justify-between flex-wrap gap-8 pb-12">
      <div className="flex-1 min-w-[200px]">
        <Link to="/">
          <img src={logo} alt="Cayman Logo" className="h-16 scale-x-150 pl-7  w-auto transition-transform duration-300 scale-y-150" />
        </Link>
        <p className="mb-2">Your trusted partner for home services.</p>
      </div>
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
        <a
          href="#"
          className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors"
        >
          AC Repair
        </a>
        <a
          href="#"
          className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors"
        >
          Plumbing
        </a>
        <a
          href="#"
          className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors"
        >
          Electrician
        </a>
        <a
          href="#"
          className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors"
        >
          Home Cleaning
        </a>
      </div>
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
        <p className="mb-2">contact@cayman.com</p>
        <p className="mb-2">+1 (345) 555-1234</p>
      </div>
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-lg font-semibold text-white mb-4">Social</h3>
        <a
          href="#"
          className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors"
        >
          Facebook
        </a>
        <a
          href="#"
          className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors"
        >
          Twitter
        </a>
        <a
          href="#"
          className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors"
        >
          Instagram
        </a>
      </div>
    </div>
    <div className="border-t border-gray-700 text-center py-6 text-sm">
      <p>
        &copy; {new Date().getFullYear()} Caymantainane Home Services. All
        rights reserved.
      </p>
    </div>
  </footer>
    </div>
  );
};

export default Home;

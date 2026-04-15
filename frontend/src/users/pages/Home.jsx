import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Star, Fan, Zap, Droplet, Home as HomeIcon, Snowflake, BrushCleaning, Wrench, Bug, Sparkles, CalendarDays, Clock } from 'lucide-react';
import logo from '../../../public/logo-cayman2.png'

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
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV6bM0KWuY_1vnCdkC_PXcW9GMK3RmT6oydg&s"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const popularServices = [
    { name: 'AC Repair', icon: <Snowflake />, color: '#3B82F6' },
    { name: 'Electrician', icon: <Zap />, color: '#F59E0B' },
    { name: 'Plumbing', icon: <Droplet />, color: '#06B6D4' },
    { name: 'Home Cleaning', icon: <BrushCleaning />, color: '#10B981' },
    { name: 'Appliance Repair', icon: <Wrench />, color: '#6366F1' },
    { name: 'Pest Control', icon: <Bug />, color: '#EF4444' },
  ];

  const howItWorksSteps = [
    { number: 1, title: 'Choose Service', description: 'Select the service you need from our wide range of options.' },
    { number: 2, title: 'Book a Time', description: 'Pick a convenient date and time that works for you.' },
    { number: 3, title: 'Get It Done', description: 'A verified professional will arrive on time and complete the job.' }
  ];

  const whyChooseUsPoints = [
    { title: 'Verified Professionals', description: 'We vet every professional to ensure you get the best and most reliable service.' },
    { title: 'Transparent Pricing', description: 'See the price upfront. No hidden fees, no surprises.' },
    { title: 'Fast Service', description: 'Book in minutes and get a professional at your door, often on the same day.' },
    { title: 'Customer Support', description: 'Our support team is here to help you every step of the way.' }
  ];

  const testimonials = [
    { review: "Caymantainane is a lifesaver! My AC broke down during a heatwave, and they had someone here within 2 hours. Fantastic service!", author: "Sarah J., George Town" },
    { review: "The booking process was so simple. The cleaner was professional and did an amazing job. My home has never been so clean!", author: "Mike D., West Bay" },
    { review: "I was impressed with the transparent pricing. I knew exactly what I was paying for. Highly recommend for any plumbing needs.", author: "Emily R., Bodden Town" }
  ];

  return (
    <div className="font-sans text-gray-700 bg-white">
      {/* 1. Hero Section */}
      <section className="relative px-8 pt-40 pb-48 text-center overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img src={img} alt="Hero Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 backdrop-blur-[1px]"></div>
          </div>
        ))}
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 py-2 px-4 bg-white/90 backdrop-blur-md border border-indigo-100 rounded-full text-indigo-600 font-semibold text-sm mb-6 shadow-sm"><Sparkles className="w-4 h-4" /> #1 Home Service Provider</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">Book Trusted <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Home Services</span> in Minutes</h1>
          <p className="text-lg md:text-xl text-black mb-10 max-w-xl mx-auto">From AC repair to home cleaning — we connect you with verified professionals near you.</p>
          <div className="flex justify-center gap-6">
            <button onClick={() => navigate('/bookingpage')} className="py-3 px-6 md:py-4 md:px-8 text-base rounded-full cursor-pointer font-semibold transition-transform hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md shadow-blue-500/50">Book Now</button>
            <button onClick={() => navigate('/service')} className="py-3 px-6 md:py-4 md:px-8 text-base rounded-full cursor-pointer font-semibold shadow-md transition-transform hover:scale-105 bg-white text-gray-800">Explore Services</button>
          </div>
        </div>
      </section>

      {/* 2. Search Bar */}
      <section className="px-4 sm:px-8 bg-white -mt-14 relative z-10 flex justify-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-2xl shadow-xl w-full max-w-4xl border border-gray-100">
          <input type="text" placeholder="Search services (AC repair, plumber, etc.)" className="flex-[2] py-3 px-4 border border-gray-200 rounded-lg text-base outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Your Location" className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-base outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500" />
          <button className="flex-shrink-0 rounded-lg py-3 px-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md transition-transform hover:scale-105">Search</button>
        </div>
      </section>

      {/* 3. Popular Services */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-16">Popular Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 ">
          {popularServices.map(service => {
            let iconComponent;
            if (service.name === 'AC Repair') iconComponent = <Fan className="w-8 h-8 mx-auto text-blue-500" />;
            else if (service.name === 'Electrician') iconComponent = <Zap className="w-8 h-8 mx-auto text-yellow-500" />;
            else if (service.name === 'Plumbing') iconComponent = <Droplet className="w-8 h-8 mx-auto text-cyan-500" />;
            else if (service.name === 'Home Cleaning') iconComponent = <HomeIcon className="w-8 h-8 mx-auto text-green-500" />;
            else if (service.name === 'Appliance Repair') iconComponent = <Wrench className="w-8 h-8 mx-auto text-indigo-500" />;
            else if (service.name === 'Pest Control') iconComponent = <Bug className="w-8 h-8 mx-auto text-red-500" />;
            return (
              <div key={service.name} style={{ borderTop: `4px solid ${service.color}` }} className="bg-white px-6 py-10 rounded-2xl text-center shadow-md cursor-pointer border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                <div className="mb-4 flex justify-center">{iconComponent}</div>
                <p className="text-base md:text-lg font-bold text-gray-800">{service.name}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto bg-gradient-to-b from-slate-50 to-white rounded-[32px] shadow-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              How It Works
            </h2>
            <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Follow these easy steps to get started quickly and smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Optional connecting line for desktop */}
            <div className="hidden md:block absolute top-14 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200"></div>

            {howItWorksSteps.map((step) => (
              <div
                key={step.number}
                className="relative group bg-white/90 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 text-center shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/10 group-hover:to-blue-500/5 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 Flexible Booking Section */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <button className="inline-block px-5 py-2 text-xs font-black uppercase tracking-widest text-indigo-700 bg-indigo-100 rounded-full mb-6 border border-indigo-200 shadow-sm">
            Flexible Booking
          </button>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
            Two ways to book, <br />
            <span className="text-blue-600">built around you.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Per Day Booking */}
          <div className="group bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-8 h-8" />
            </div>

            <h3 className="text-3xl font-black text-gray-900 mb-4">One-time Task</h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Need a quick fix or a deep clean? Book a professional for a specific date and time that fits your schedule perfectly.
            </p>

            <ul className="space-y-4 mb-10">
              {['Choose specific date & time', 'Instant confirmation', 'All service categories available'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={() => navigate('/bookingpage')} className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg shadow-gray-200">
              Book for a Day
            </button>
          </div>

          {/* Right: Weekly Booking */}
          <div className="group bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] p-10 text-white shadow-2xl hover:shadow-indigo-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl group-hover:bg-white/20 transition-colors"></div>

            <div className="w-16 h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-xl group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-3xl font-black">Weekly Routine</h3>
              <span className="bg-yellow-400 text-gray-900 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter shadow-sm">Popular</span>
            </div>

            <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
              Save time and enjoy a 15% discount by scheduling recurring weekly visits. Perfect for recurring maintenance.
            </p>

            <ul className="space-y-4 mb-10">
              {['Discounted rates', 'Same professional every visit', 'Priority scheduling'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-indigo-50 font-medium">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  {item}
                </li>
              ))}
              <li className="text-xs text-indigo-200/80 italic pt-2">* Available for select services like cleaning & gardening</li>
            </ul>

            <button onClick={() => navigate('/weekly-booking')} className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-xl">
              Start Weekly Plan
            </button>
          </div>
        </div>
      </section>


      {/* 5. Why Choose Us */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto bg-gradient-to-b from-white to-slate-50 rounded-[32px] relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10">
          {/* Heading */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
              Our Advantages
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              Why Choose Us
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We deliver quality, performance, and reliability to help your business grow faster.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUsPoints.map((point) => (
              <div
                key={point.title}
                className="group bg-white/80 backdrop-blur-md border border-gray-100 p-8 rounded-3xl text-center shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Icon */}
                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckmarkIcon />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-5 mb-2">
                  {point.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {point.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/10 group-hover:to-blue-500/5 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 px-8 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-16">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <p className="italic text-gray-600 mb-4">"{testimonial.review}"</p>
                <p className="font-semibold text-gray-900 text-right">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Need help? Book a service now.</h2>
        <button onClick={() => navigate('/bookingpage')} className="py-4 px-10 text-lg rounded-full cursor-pointer font-bold shadow-lg transition-transform hover:scale-105 bg-white text-blue-600">Book a Service</button>
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
            <a href="#" className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors">AC Repair</a>
            <a href="#" className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors">Plumbing</a>
            <a href="#" className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors">Electrician</a>
            <a href="#" className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors">Home Cleaning</a>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <p className="mb-2">contact@cayman.com</p>
            <p className="mb-2">+1 (345) 555-1234</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold text-white mb-4">Social</h3>
            <a href="#" className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="block text-gray-400 no-underline mb-2 hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
        <div className="border-t border-gray-700 text-center py-6 text-sm">
          <p>&copy; {new Date().getFullYear()} Caymantainane Home Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home
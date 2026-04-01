import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Home, Car, UserRound, Activity, ShoppingBag, PartyPopper, 
  ChevronLeft, Snowflake, Sparkles, Droplet, Zap, Wrench, Paintbrush, 
  Bug, Star, Bed, Scissors, Smartphone, Camera, Utensils, HeartPulse, Hammer, Bike, DropletIcon,
  ArrowRight, Dumbbell, Baby, Music
} from 'lucide-react'

const Service = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Main Categories and their Sub-services
  const serviceCategories = [
    {
      id: 'home',
      name: 'Home Services',
      description: 'AC, Cleaning, Plumbing, and more for your residence.',
      icon: <Home className="w-10 h-10" />,
      gradient: 'from-blue-500 to-indigo-600',
      subServices: [
        { id: 1, name: 'AC Repair & Service', price: 49, rating: 4.8, icon: <Snowflake className="text-blue-500" />, desc: 'Expert AC maintenance and repair.' },
        { id: 2, name: 'Deep Home Cleaning', price: 89, rating: 4.9, icon: <Sparkles className="text-purple-500" />, desc: 'Full house sanitization services.' },
        { id: 3, name: 'Professional Plumbing', price: 59, rating: 4.7, icon: <Droplet className="text-cyan-500" />, desc: 'Fixing leaks and pipe installations.' },
        { id: 4, name: 'Electrical Repairs', price: 55, rating: 4.6, icon: <Zap className="text-yellow-500" />, desc: 'Wiring and appliance safety checks.' },
        { id: 7, name: 'House Painting', price: 199, rating: 4.7, icon: <Paintbrush className="text-pink-500" />, desc: 'Interior and exterior premium painting.' },
        { id: 27, name: 'Carpenter', price: 65, rating: 4.8, icon: <Hammer className="text-orange-500" />, desc: 'Furniture repair and custom woodwork.' },
        { id: 5, name: 'Pest Control', price: 79, rating: 4.5, icon: <Bug className="text-red-500" />, desc: 'Safe treatments for your home.' },
      ]
    },
    {
      id: 'vehicle',
      name: 'Vehicle Service',
      description: 'Maintenance and repair for cars and bikes.',
      icon: <Car className="w-10 h-10" />,
      gradient: 'from-slate-700 to-slate-900',
      subServices: [
        { id: 12, name: 'Car Detailing', price: 75, rating: 4.7, icon: <Droplet className="text-blue-400" />, desc: 'Interior and exterior deep wash.' },
        { id: 13, name: 'General Car Repair', price: 99, rating: 4.8, icon: <Wrench className="text-gray-600" />, desc: 'Engine diagnostic and part fixes.' },
        { id: 14, name: 'Battery Jumpstart', price: 30, rating: 4.9, icon: <Zap className="text-amber-500" />, desc: 'On-road emergency assistance.' },
        { id: 15, name: 'Tyre Replacement', price: 120, rating: 4.6, icon: <Activity className="text-red-500" />, desc: 'New tyre fitting and balancing.' },
        { id: 28, name: 'Bike Service', price: 45, rating: 4.7, icon: <Bike className="text-slate-600" />, desc: 'Oil change and general maintenance for bikes.' },
      ]
    },
    {
      id: 'personal',
      name: 'Personal Care',
      description: 'Beauty, grooming, and wellness at home.',
      icon: <UserRound className="w-10 h-10" />,
      gradient: 'from-pink-500 to-rose-600',
      subServices: [
        { id: 29, name: 'Haircut for Women', price: 60, rating: 4.9, icon: <Scissors className="text-pink-500" />, desc: 'Stylish haircuts and hair treatments.' },
        { id: 30, name: 'Haircut & Shave for Men', price: 40, rating: 4.7, icon: <UserRound className="text-blue-500" />, desc: 'Professional haircuts and beard grooming.' },
        { id: 31, name: 'Facial & Skincare', price: 70, rating: 4.8, icon: <Sparkles className="text-purple-500" />, desc: 'Rejuvenating facials and skin treatments.' },
        { id: 18, name: 'Massage Therapy', price: 80, rating: 4.8, icon: <Activity className="text-emerald-500" />, desc: 'Stress-relief and relaxation.' },
        { id: 32, name: 'Spa & Body Treatments', price: 120, rating: 4.9, icon: <Droplet className="text-cyan-500" />, desc: 'Luxurious spa and body wellness services.' },
        { id: 33, name: 'Hair Styling & Treatment', price: 90, rating: 4.7, icon: <Scissors className="text-orange-500" />, desc: 'Advanced hair styling and deep conditioning.' },
        { id: 34, name: 'Nail Care (Mani/Pedi)', price: 50, rating: 4.6, icon: <Star className="text-yellow-500" />, desc: 'Manicures, pedicures, and nail art.' },
        { id: 19, name: 'Makeup Artist', price: 150, rating: 4.9, icon: <Sparkles className="text-purple-500" />, desc: 'Occasion and bridal makeup.' },
      ]
    },
    {
      id: 'health',
      name: 'Health & Medical',
      description: 'Home healthcare and medical rentals.',
      icon: <HeartPulse className="w-10 h-10" />,
      gradient: 'from-emerald-500 to-teal-600',
      subServices: [
        { id: 11, name: 'Lab Test at Home', price: 95, rating: 4.7, icon: <Activity className="text-rose-500" />, desc: 'Full body diagnostic tests at your doorstep.' },
        { id: 9, name: 'Medical Bed', price: 150, rating: 4.8, icon: <Bed className="text-blue-600" />, desc: 'Comfortable recovery equipment.' },
        { id: 10, name: 'Doctor Appointment', price: 120, rating: 4.9, icon: <UserRound className="text-emerald-500" />, desc: 'Video or in-person consultation with experts.' },
        { id: 20, name: 'Nursing Care', price: 200, rating: 4.8, icon: <Activity className="text-blue-400" />, desc: 'Professional home nursing support.' },
        { id: 35, name: 'Fitness & Yoga', price: 50, rating: 4.9, icon: <Dumbbell className="text-orange-500" />, desc: 'Personal trainers and yoga sessions at home.' },
      ]
    },
    {
      id: 'convenience',
      name: 'Daily Convenience',
      description: 'Laundry, repairs, and everyday tasks.',
      icon: <ShoppingBag className="w-10 h-10" />,
      gradient: 'from-amber-500 to-orange-600',
      subServices: [
        { id: 21, name: 'Laundry Service', price: 25, rating: 4.6, icon: <Droplet className="text-blue-400" />, desc: 'Wash, dry, and iron services.' },
        { id: 36, name: 'Housemaid booking', price: 15, rating: 4.8, icon: <UserRound className="text-blue-500" />, desc: 'Verified housemaids for daily chores.' },
        { id: 37, name: 'Baby Sitting', price: 25, rating: 4.9, icon: <Baby className="text-pink-500" />, desc: 'Professional and caring babysitters.' },
      ]
    },
    {
      id: 'events',
      name: 'Event & Occasion',
      description: 'Make your special moments memorable.',
      icon: <PartyPopper className="w-10 h-10" />,
      gradient: 'from-purple-600 to-fuchsia-700',
      subServices: [
        { id: 23, name: 'Photography', price: 250, rating: 4.9, icon: <Camera className="text-purple-500" />, desc: 'Professional event coverage.' },
        { id: 24, name: 'Catering Service', price: 500, rating: 4.8, icon: <Utensils className="text-orange-500" />, desc: 'Delicious food for your guests.' },
        { id: 25, name: 'Event Decoration', price: 300, rating: 4.7, icon: <Sparkles className="text-pink-400" />, desc: 'Theme-based venue styling.' },
        { id: 26, name: 'Event Planning', price: 400, rating: 4.8, icon: <Zap className="text-amber-500" />, desc: 'End-to-end event management.' },
        { id: 38, name: 'DJ/Music Service', price: 200, rating: 4.8, icon: <Music className="text-indigo-500" />, desc: 'Professional DJ and sound systems for events.' },
      ]
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory]);

  return (
    <div className="bg-[#fbb040] min-h-screen pb-20 font-sans">
      
      {/* Hero Header */}
      <div className="bg-[radial-gradient(circle_at_top_right,#1e293b_0%,#0f172a_100%)] text-white py-20 px-8 text-center mb-12 shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {selectedCategory ? selectedCategory.name : 'How can we help you today?'}
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            {selectedCategory ? selectedCategory.description : 'Select a category to explore professional services near you.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Category Drill-down Navigation */}
        {selectedCategory && (
          <button 
            onClick={() => setSelectedCategory(null)}
            className="mb-8 flex items-center gap-2 text-slate-800 hover:text-blue-600 font-bold transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </button>
        )}

        {/* Main Grid Logic */}
        {!selectedCategory ? (
          /* STEP 1: SHOW 6 CATEGORIES */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {serviceCategories.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat)}
                className="group relative bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">{cat.name}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{cat.description}</p>
                <div className="flex items-center text-blue-600 font-bold gap-2">
                  Explore Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  {cat.icon}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* STEP 2: SHOW SUB-SERVICES FOR SELECTED CATEGORY */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
            {selectedCategory.subServices.map(sub => (
              <div 
                key={sub.id} 
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-xl hover:border-blue-100"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    {React.cloneElement(sub.icon, { className: "w-8 h-8" })}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" /> {sub.rating}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{sub.name}</h3>
                <p className="text-slate-500 text-sm mb-8">{sub.desc}</p>
                
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase block mb-0.5">Starting from</span>
                    <span className="text-2xl font-black text-slate-900">${sub.price}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/service/${sub.id}`)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-100"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
  )
}

export default Service
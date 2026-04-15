import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Home, Car, UserRound, HeartPulse, ShoppingBag, PartyPopper } from 'lucide-react'
import logo from '../../../public/logo1.png'

const About = () => {
  const navigate = useNavigate()
  const services = [
    { title: 'Home Services', icon: <Home className="w-12 h-12 text-blue-500" />, color: '#3B82F6' },
    { title: 'Vehicle Servicees', icon: <Car className="w-12 h-12 text-amber-500" />, color: '#F59E0B' },
    { title: 'Personal Care', icon: <UserRound className="w-12 h-12 text-cyan-500" />, color: '#06B6D4' },
    { title: 'Health & Medical', icon: <HeartPulse className="w-12 h-12 text-emerald-500" />, color: '#10B981' },
    { title: 'Daily Convenience', icon: <ShoppingBag className="w-12 h-12 text-indigo-500" />, color: '#6366F1' },
    { title: 'Event & Occasion', icon: <PartyPopper className="w-12 h-12 text-red-500" />, color: '#EF4444' },
  ];

  const values = [
    { title: 'Trust', bg: '#EFF6FF', color: '#1D4ED8' },
    { title: 'Quality', bg: '#ECFDF5', color: '#047857' },
    { title: 'Reliability', bg: '#FFFBEB', color: '#B45309' },
    { title: 'Customer First', bg: '#F5F3FF', color: '#6D28D9' }
  ];

  const features = [
    { title: 'Verified Professionals', desc: 'Background checked and trained experts.' },
    { title: 'Transparent Pricing', desc: 'Upfront quotes, no hidden fees.' },
    { title: 'On-Time Service', desc: 'We value your time and schedule.' },
    { title: 'Customer Satisfaction', desc: 'We are not happy until you are.' },
  ];

  const processSteps = [
    { title: 'Choose a Service', desc: 'Select from our wide range of services.' },
    { title: 'Book a Time', desc: 'Pick a slot that works for you.' },
    { title: 'Get Professional Help', desc: 'Our experts arrive and get the job done.' },
  ];

  return (
    <div className="font-sans text-gray-700 bg-white">
      {/* 1. Hero Section */}
      <section className="bg-[radial-gradient(circle_at_top_right,_#F0F9FF_0%,_#E0E7FF_40%,_#F5F3FF_100%)] pt-24 sm:pt-40 pb-16 sm:pb-32 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-2 px-4 bg-white rounded-full text-indigo-600 font-semibold text-sm mb-6 shadow-sm">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">About <span className="bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">Caymantainane</span></h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We connect you with trusted professionals for all your home service needs — <span className="text-blue-600 font-semibold">quickly</span>, <span className="text-emerald-600 font-semibold">safely</span>, and <span className="text-purple-600 font-semibold">affordably</span>.
          </p>
        </div>
      </section>

      {/* 2. Our Mission */}
      <section className="py-12 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">Our Mission</h2>
          <h3 className="text-2xl md:text-3xl text-gray-700 leading-snug font-medium">
            Our mission is to simplify everyday living by providing reliable, high-quality home services at your fingertips. We believe finding help for your home shouldn't be a chore.
          </h3>
        </div>
      </section>

      {/* 3. What We Do */}
      <section className="py-12 sm:py-24 px-4 sm:px-8 bg-gray-50">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">What We Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((item, index) => (
            <div key={index} style={{ borderTop: `4px solid ${item.color}` }} className="bg-white p-6 sm:p-10 rounded-[20px] shadow-sm text-center border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-12 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((item, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white border-l-[5px] border-blue-600 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Our Process */}
      <section className="py-12 sm:py-24 px-4 sm:px-8 bg-gray-50">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">Our Process</h2>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 text-center">
          {processSteps.map((step, index) => (
            <div key={index} className="flex-1 min-w-[250px] p-8 transition-transform duration-300 hover:scale-105">
              <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                <span className="text-2xl font-bold text-white">{index + 1}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Our Values */}
      <section className="py-12 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, index) => (
            <div key={index} style={{ backgroundColor: val.bg, color: val.color }} className="p-10 rounded-2xl shadow-sm text-center border border-gray-200 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-2xl font-bold m-0">{val.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 py-16 sm:py-32 px-4 sm:px-8 text-center text-white">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-10">Ready to book your service?</h2>
        <button onClick={() => { window.scrollTo(0, 0); navigate('/service') }} className="bg-white text-indigo-600 py-3 sm:py-5 px-6 sm:px-14 rounded-full text-lg sm:text-xl font-bold shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">Explore Services</button>
      </section>

      {/* 8. Footer */}
      <footer className="bg-gray-200 text-gray-700 py-10 sm:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between flex-wrap gap-12 mb-12">
          <div className="flex-1 min-w-[200px]">
            <img src={logo} alt="Cayman Logo" className="h-12 sm:h-16 w-auto transition-transform duration-300 sm:pl-7 sm:scale-150" />
            <p className="mb-2">Your trusted home partner.</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-gray-700 mb-4 text-lg font-semibold">Contact</h4>
            <p className="mb-2">support@cayman.com</p>
            <p className="mb-2">+1 (555) 123-4567</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-gray-700 mb-4 text-lg font-semibold">Social</h4>
            <p className="mb-2">Instagram | Facebook | Twitter</p>
          </div>
        </div>
        <div className="text-center border-t border-gray-800 pt-8 text-sm">
          &copy; {new Date().getFullYear()} Caymantainane Home Services.
        </div>
      </footer>
    </div>
  )
}

export default About
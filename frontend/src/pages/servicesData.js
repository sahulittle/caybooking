export const allServicesData = [
  {
    id: 1,
    title: 'AC Repair & Service',
    category: 'Cooling',
    rating: 4.8,
    reviews: 1240,
    description: 'Expert AC repair and services to ensure your air conditioner runs efficiently. We handle everything from basic servicing to complex repairs for split and window ACs. Our technicians are certified and use genuine spare parts.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
    features: [
      '30-day service warranty',
      'Background verified technicians',
      'Transparent pricing',
      'Safety protocols followed',
      'Genuine spare parts',
      'On-time service guarantee'
    ],
    plans: [
      { id: 1, name: 'Basic Service', price: 49, desc: 'Filter cleaning, coil checking, and gas check.' },
      { id: 2, name: 'Deep Cleaning', price: 89, desc: 'Foam jet cleaning of indoor and outdoor units.' },
      { id: 3, name: 'Gas Refill', price: 120, desc: 'Complete gas refill with leak identification.' },
    ],
    customerReviews: [
      { id: 1, user: 'Alex Johnson', rating: 5, comment: 'Technician was very professional and on time. Fixed the cooling issue quickly.' },
      { id: 2, user: 'Sarah Williams', rating: 4, comment: 'Good service, but arrived slightly late. Work quality was excellent though.' },
    ]
  },
  {
    id: 2,
    title: 'Deep Home Cleaning',
    category: 'Cleaning',
    rating: 4.9,
    reviews: 2150,
    description: 'Our deep cleaning service is perfect for making your home spotless. We cover areas that are not usually covered in a regular cleaning, ensuring a hygienic and fresh environment for you and your family.',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=2070&auto=format&fit=crop',
    features: [
      'Includes all rooms, kitchen, and bathrooms',
      'Use of eco-friendly cleaning supplies',
      'Trained and professional staff',
      'Stain and spot removal',
      'Disinfection of high-touch surfaces',
      'Satisfaction guaranteed'
    ],
    plans: [
      { id: 1, name: '1 BHK', price: 89, desc: 'Complete deep cleaning for a 1 BHK apartment.' },
      { id: 2, name: '2 BHK', price: 129, desc: 'Complete deep cleaning for a 2 BHK apartment.' },
      { id: 3, name: '3 BHK', price: 159, desc: 'Complete deep cleaning for a 3 BHK apartment.' },
    ],
    customerReviews: [
      { id: 1, user: 'Maria Garcia', rating: 5, comment: 'Absolutely fantastic! My apartment looks brand new. The team was thorough and very polite.' },
      { id: 2, user: 'David Smith', rating: 5, comment: 'Worth every penny. They cleaned places I didn\'t even know were dirty. Highly recommend.' },
    ]
  },
  {
    id: 3,
    title: 'Professional Plumbing',
    category: 'Plumbing',
    rating: 4.7,
    reviews: 980,
    description: 'From leaky faucets to clogged drains, our professional plumbers are here to help. We provide fast and reliable solutions for all your plumbing needs, ensuring long-lasting repairs.',
    image: 'https://images.unsplash.com/photo-1576016393323-2b27b5a4de8a?q=80&w=2070&auto=format&fit=crop',
    features: [
      'Leak detection and repair',
      'Drain cleaning and unclogging',
      'Fixture installation and repair',
      '24/7 emergency service available',
      'Licensed and insured plumbers',
      'Upfront and honest pricing'
    ],
    plans: [
      { id: 1, name: 'Minor Leak Repair', price: 59, desc: 'Fixing small leaks in faucets or pipes.' },
      { id: 2, name: 'Drain Unclogging', price: 79, desc: 'Clearing blockages from sinks or showers.' },
      { id: 3, name: 'Fixture Installation', price: 99, desc: 'Installation of a new faucet, showerhead, etc.' },
    ],
    customerReviews: [
      { id: 1, user: 'James Brown', rating: 5, comment: 'The plumber arrived within an hour and fixed my sink. Very efficient and professional service.' },
    ]
  },
  // Placeholder data for other services
  {
    id: 4,
    title: 'Electrical Repairs',
    image: 'https://images.unsplash.com/photo-1497435334326-5266368360a2?q=80&w=2070&auto=format&fit=crop',
    rating: 4.6,
    reviews: 850,
    description: 'Certified electricians for all your wiring, fixture, and appliance safety needs.',
    features: ['Certified electricians', 'Safety inspection'],
    plans: [{ id: 1, name: 'Hourly Rate', price: 55, desc: 'For general electrical work.' }],
    customerReviews: []
  },
  {
    id: 5,
    title: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1605210942842-c9ef63995a61?q=80&w=2070&auto=format&fit=crop',
    rating: 4.5,
    reviews: 730,
    description: 'Safe and effective treatments to make your home pest-free.',
    features: ['Eco-friendly solutions', 'Child and pet safe'],
    plans: [{
      id: 1, name: 'General Pest Control', price: 79, desc: 'Comprehensive treatment.'
    }],
    customerReviews: []
  },
  {
    id: 6,
    title: 'Appliance Repair',
    image: 'https://images.unsplash.com/photo-1617103994232-353395fe3a26?q=80&w=1932&auto=format&fit=crop',
    rating: 4.4,
    reviews: 690,
    description: 'Quick and reliable fixes for your home appliances.',
    features: ['All major brands repaired', '30-day warranty'],
    plans: [{ id: 1, name: 'Diagnostic Fee', price: 65, desc: 'Fee adjusted upon repair.' }],
    customerReviews: []
  },
  {
    id: 7,
    title: 'House Painting',
    image: 'https://images.unsplash.com/photo-1596276235133-31543a4a4593?q=80&w=1974&auto=format&fit=crop',
    rating: 4.7,
    reviews: 450,
    description: 'Refresh your home with our professional painting services.',
    features: ['Interior and exterior', 'Color consultation'],
    plans: [{ id: 1, name: 'Per Room', price: 199, desc: 'Standard-sized room.' }],
    customerReviews: []
  },
  {
    id: 8,
    title: 'Garden Maintenance',
    image: 'https://images.unsplash.com/photo-1593005510329-8a4216b14c75?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    reviews: 560,
    description: 'Keep your garden looking its best with our maintenance services.',
    features: ['Lawn mowing', 'Hedge trimming'],
    plans: [{ id: 1, name: 'Basic Maintenance', price: 45, desc: 'Lawn mowing and clean-up.' }],
    customerReviews: []
  },
  {
    id: 9,
    title: 'Hospital Bed Rental',
    category: 'Healthcare',
    rating: 4.8,
    reviews: 320,
    description: 'High-quality medical beds for comfortable home recovery. Our beds are adjustable and come with specialized mattresses designed for long-term patient care. Ideal for post-surgery recovery or elderly care.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
    features: [
      'Adjustable head and foot sections',
      'Side rails for patient safety',
      'Includes medical-grade mattress',
      'Free delivery and professional setup',
      'Sanitized before every delivery',
      '24/7 maintenance support'
    ],
    plans: [
      { id: 1, name: 'Standard Manual Bed', price: 150, desc: 'Monthly rental for a manual crank adjustable bed.' },
      { id: 2, name: 'Semi-Electric Bed', price: 250, desc: 'Monthly rental for head and foot adjustable bed via remote.' },
      { id: 3, name: 'Fully Electric Bed', price: 350, desc: 'Complete remote control including height adjustments.' },
    ],
    customerReviews: [
      { id: 1, user: 'Robert Chen', rating: 5, comment: 'The bed was in excellent condition and set up quickly. Made home recovery much easier.' },
    ]
  },
  {
    id: 10,
    title: 'Professional Consulting',
    category: 'Healthcare',
    rating: 4.9,
    reviews: 150,
    description: 'Expert healthcare and home maintenance advisory services. Get professional advice on home patient care, medical equipment requirements, or complex home renovation projects from certified experts.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop',
    features: [
      'Certified healthcare consultants',
      'Personalized care planning',
      'Video or in-person sessions',
      'Detailed advisory reports',
      'Equipment recommendation',
      'Follow-up support'
    ],
    plans: [
      { id: 1, name: 'Quick Session', price: 60, desc: '30-minute consultation for specific medical or maintenance queries.' },
      { id: 2, name: 'Standard Consultation', price: 120, desc: '60-minute in-depth advisory and planning session.' },
      { id: 3, name: 'Premium Strategy', price: 200, desc: 'Comprehensive consultation with a detailed roadmap and report.' },
    ],
    customerReviews: [
      { id: 1, user: 'Linda White', rating: 5, comment: 'Very insightful consultation. Helped us plan the home care for my father efficiently.' },
    ]
  },
  {
    id: 11,
    title: 'Health Check-up & Tests',
    category: 'Healthcare',
    rating: 4.7,
    reviews: 540,
    description: 'Diagnostic tests and routine health check-ups delivered at your doorstep. Our professional phlebotomists ensure a comfortable and safe sample collection process in the comfort of your home.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop',
    features: [
      'Home sample collection',
      'NABL accredited laboratory processing',
      'Digital reports within 24 hours',
      'Strict safety and hygiene protocols',
      'Experienced healthcare technicians',
      'Free report consultation'
    ],
    plans: [
      { id: 1, name: 'Basic Profile', price: 95, desc: 'Essential tests including CBC, Glucose, and Cholesterol.' },
      { id: 2, name: 'Full Body Checkup', price: 180, desc: 'Comprehensive health profile with over 60 parameters.' },
      { id: 3, name: 'Specialized Panel', price: 150, desc: 'Targeted panels for Cardiac, Diabetic, or Thyroid health.' },
    ],
    customerReviews: [
      { id: 1, user: 'Emily Davis', rating: 4, comment: 'Very convenient service. The technician was skilled and reports were on time.' },
    ]
  },
];
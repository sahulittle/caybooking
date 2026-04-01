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
    category: 'Home Services',
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
    title: 'Doctor Appointment',
    category: 'Healthcare',
    rating: 4.9,
    reviews: 150,
    description: 'Book professional medical consultations at your convenience. Our network of certified doctors provides expert advice through video or in-person visits to help manage your health concerns effectively.',
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
    title: 'Lab Test at Home',
    category: 'Healthcare',
    rating: 4.7,
    reviews: 540,
    description: 'Get your blood work and diagnostic tests done without leaving your house. Our professional phlebotomists ensure a painless sample collection process with reports delivered digitally within 24 hours.',
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
  {
    id: 12,
    title: 'Car Detailing',
    category: 'Vehicle',
    rating: 4.7,
    reviews: 420,
    description: 'Professional interior and exterior deep cleaning for your vehicle. We use premium products to restore your car\'s shine and ensure a sanitized cabin.',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070&auto=format&fit=crop',
    features: ['Exterior foam wash', 'Interior vacuuming', 'Dashboard polishing', 'Upholstery cleaning'],
    plans: [
      { id: 1, name: 'Basic Wash', price: 45, desc: 'External wash and interior vacuuming.' },
      { id: 2, name: 'Full Detailing', price: 75, desc: 'Deep cleaning with wax protection.' }
    ],
    customerReviews: []
  },
  {
    id: 13,
    title: 'General Car Repair',
    category: 'Vehicle',
    rating: 4.8,
    reviews: 650,
    description: 'Comprehensive mechanical repairs and diagnostics for all car makes and models. Our certified mechanics handle engine, brakes, and suspension issues.',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2072&auto=format&fit=crop',
    features: ['Engine diagnostics', 'Brake service', 'Suspension repair', 'Oil change'],
    plans: [
      { id: 1, name: 'Inspection', price: 50, desc: 'Full vehicle health check.' },
      { id: 2, name: 'Major Service', price: 150, desc: 'Service including oil and filter changes.' }
    ],
    customerReviews: []
  },
  {
    id: 14,
    title: 'Battery Jumpstart',
    category: 'Vehicle',
    rating: 4.9,
    reviews: 210,
    description: 'Fast on-road emergency assistance for dead batteries. We provide jumpstart services or battery replacement at your location.',
    image: 'https://images.unsplash.com/photo-1620939511593-29937fd6f187?q=80&w=2071&auto=format&fit=crop',
    features: ['24/7 Availability', 'Fast response time', 'Battery health check', 'New battery installation'],
    plans: [
      { id: 1, name: 'Jumpstart Only', price: 30, desc: 'Emergency jumpstart service.' },
      { id: 2, name: 'Battery Replacement', price: 150, desc: 'Jumpstart + New Battery installation.' }
    ],
    customerReviews: []
  },
  {
    id: 15,
    title: 'Tyre Replacement',
    category: 'Vehicle',
    rating: 4.6,
    reviews: 340,
    description: 'Professional tyre replacement and balancing services. Choose from a wide range of top tyre brands for safety and performance.',
    image: 'https://images.unsplash.com/photo-1549027312-d8182089448a?q=80&w=2070&auto=format&fit=crop',
    features: ['Tyre fitting', 'Wheel balancing', 'Alignment check', 'Brand variety'],
    plans: [
      { id: 1, name: 'Puncture Repair', price: 20, desc: 'Standard puncture fix.' },
      { id: 2, name: 'Tyre Fitting', price: 120, desc: 'Fitting and balancing per tyre.' }
    ],
    customerReviews: []
  },
  {
    id: 16,
    title: 'Salon for Women',
    category: 'Personal Care',
    rating: 4.9,
    reviews: 1200,
    description: 'Premium salon services at the comfort of your home. Hair, facials, waxing, and more by professional stylists.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop',
    features: ['Hygienic practices', 'Professional products', 'Experienced stylists', 'Home comfort'],
    plans: [
      { id: 1, name: 'Hair & Facial', price: 80, desc: 'Haircut and herbal facial.' },
      { id: 2, name: 'Wedding Package', price: 250, desc: 'Full makeover and styling.' }
    ],
    customerReviews: []
  },
  {
    id: 17,
    title: 'Salon for Men',
    category: 'Personal Care',
    rating: 4.7,
    reviews: 800,
    description: 'Grooming services for men including haircuts, beard styling, and skincare at home.',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop',
    features: ['Professional barbers', 'Skin friendly products', 'Mess-free service'],
    plans: [
      { id: 1, name: 'Basic Grooming', price: 40, desc: 'Haircut and beard trim.' },
      { id: 2, name: 'Face Cleanup', price: 60, desc: 'Grooming + deep face cleanup.' }
    ],
    customerReviews: []
  },
  {
    id: 18,
    title: 'Massage Therapy',
    category: 'Personal Care',
    rating: 4.8,
    reviews: 950,
    description: 'Relax and rejuvenate with our professional massage therapies. Stress-relief and deep tissue options available.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    features: ['Certified therapists', 'Soothing environment', 'Pain relief focus'],
    plans: [
      { id: 1, name: 'De-stress Massage', price: 80, desc: '60-minute relaxation session.' },
      { id: 2, name: 'Deep Tissue', price: 110, desc: '90-minute therapeutic session.' }
    ],
    customerReviews: []
  },
  {
    id: 19,
    title: 'Makeup Artist',
    category: 'Personal Care',
    rating: 4.9,
    reviews: 560,
    description: 'Professional makeup for parties, weddings, and photoshoots. High-end products used for a flawless look.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop',
    features: ['High-end cosmetics', 'Customized looks', 'Bridal specialists'],
    plans: [
      { id: 1, name: 'Party Makeup', price: 120, desc: 'Occasion-based glam look.' },
      { id: 2, name: 'Bridal Makeup', price: 450, desc: 'Full premium bridal transformation.' }
    ],
    customerReviews: []
  },
  {
    id: 20,
    title: 'Nursing Care',
    category: 'Healthcare',
    rating: 4.8,
    reviews: 280,
    description: 'Experienced home nursing services for elderly care, post-operative recovery, and chronic illness management.',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2018&auto=format&fit=crop',
    features: ['Trained nurses', 'Medication management', 'Vitals monitoring'],
    plans: [
      { id: 1, name: 'Daily Visit', price: 50, desc: 'Single nurse visit per day.' },
      { id: 2, name: '24/7 Nursing', price: 300, desc: 'Full-day care with rotation.' }
    ],
    customerReviews: []
  },
  {
    id: 21,
    title: 'Laundry Service',
    category: 'Convenience',
    rating: 4.6,
    reviews: 670,
    description: 'Professional wash, dry, and iron services with home pickup and delivery. Care for all garment types.',
    image: 'https://images.unsplash.com/photo-1545173153-548ca07ec921?q=80&w=2070&auto=format&fit=crop',
    features: ['Doorstep pickup', 'Fabric-safe cleaning', 'Quick turnaround'],
    plans: [
      { id: 1, name: 'Standard Wash', price: 25, desc: 'Wash and fold per load.' },
      { id: 2, name: 'Wash & Iron', price: 40, desc: 'Premium wash with steam press.' }
    ],
    customerReviews: []
  },
  {
    id: 22,
    title: 'Mobile Repair',
    category: 'Convenience',
    rating: 4.5,
    reviews: 890,
    description: 'Quick repair for smartphones and tablets. Screen replacement, battery fixes, and software updates.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop',
    features: ['On-site repair', 'Original parts', 'Warranty included'],
    plans: [
      { id: 1, name: 'Diagnostic', price: 20, desc: 'Identify software or hardware issues.' },
      { id: 2, name: 'Screen Fix', price: 80, desc: 'Replacement with high-quality screen.' }
    ],
    customerReviews: []
  },
  {
    id: 23,
    title: 'Photography',
    category: 'Events',
    rating: 4.9,
    reviews: 430,
    description: 'Capture your precious moments with professional photography services for weddings, birthdays, and corporate events.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2076&auto=format&fit=crop',
    features: ['Professional equipment', 'Digital album', 'Editing included'],
    plans: [
      { id: 1, name: 'Event Shoot', price: 250, desc: '4-hour event coverage.' },
      { id: 2, name: 'Full Day', price: 600, desc: 'Full day coverage with editing.' }
    ],
    customerReviews: []
  },
  {
    id: 24,
    title: 'Catering Service',
    category: 'Events',
    rating: 4.8,
    reviews: 580,
    description: 'Delicious food and professional catering for all your events. Customized menus to suit your preferences.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop',
    features: ['Custom menus', 'Live counters', 'Hygienic prep'],
    plans: [
      { id: 1, name: 'Mini Party', price: 300, desc: 'Dinner for up to 20 guests.' },
      { id: 2, name: 'Large Event', price: 1000, desc: 'Full service for 50+ guests.' }
    ],
    customerReviews: []
  },
  {
    id: 25,
    title: 'Event Decoration',
    category: 'Events',
    rating: 4.7,
    reviews: 310,
    description: 'Beautiful theme-based venue styling for birthdays, anniversaries, and corporate events.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
    features: ['Theme customization', 'Fast setup', 'Creative props'],
    plans: [
      { id: 1, name: 'Home Decor', price: 150, desc: 'Simple home event decoration.' },
      { id: 2, name: 'Venue Stylist', price: 500, desc: 'Full venue theme decoration.' }
    ],
    customerReviews: []
  },
  {
    id: 26,
    title: 'Event Planning',
    category: 'Events',
    rating: 4.8,
    reviews: 240,
    description: 'End-to-end management of your special occasions. We handle everything from vendor coordination to venue selection.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop',
    features: ['Vendor coordination', 'Budget management', 'Day-of coordination'],
    plans: [
      { id: 1, name: 'Consultation', price: 100, desc: 'Single strategy and planning session.' },
      { id: 2, name: 'Full Planner', price: 800, desc: 'End-to-end event management.' }
    ],
    customerReviews: []
  },
  {
    id: 27,
    title: 'Carpenter',
    category: 'Home Services',
    rating: 4.8,
    reviews: 320,
    description: 'Expert carpentry services for your home. From furniture repair to custom woodwork installations, our skilled carpenters deliver quality craftsmanship.',
    image: 'https://images.unsplash.com/photo-1621905252507-b35a83013b28?q=80&w=2070&auto=format&fit=crop',
    features: ['Furniture repair', 'Door/Window fixing', 'Custom cabinets', 'Polishing and finishing'],
    plans: [
      { id: 1, name: 'General Repair', price: 65, desc: 'Fixing broken furniture or hardware.' },
      { id: 2, name: 'Custom Project', price: 150, desc: 'Consultation and start of custom woodwork.' }
    ],
    customerReviews: [
      { id: 1, user: 'John Doe', rating: 5, comment: 'Fixed my creaky doors and built a custom shelf. Excellent work!' }
    ]
  },
  {
    id: 28,
    title: 'Bike Service',
    category: 'Vehicle',
    rating: 4.7,
    reviews: 215,
    description: 'Professional bike servicing and maintenance. We provide oil changes, brake adjustments, chain lubrication, and general check-ups to keep your motorcycle or scooter in top condition.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f97dbbe480?q=80&w=2070&auto=format&fit=crop',
    features: ['Oil & filter change', 'Chain cleaning & lubing', 'Brake inspection', 'Electrical check-up'],
    plans: [
      { id: 1, name: 'Basic Service', price: 45, desc: 'General checkup and oil change.' },
      { id: 2, name: 'Full Service', price: 85, desc: 'Comprehensive service with deep cleaning.' }
    ],
    customerReviews: [
      { id: 1, user: 'Sarah Connor', rating: 5, comment: 'Quick oil change and chain adjustment. Very convenient!' }
    ]
  },
  {
    id: 29,
    title: 'Haircut for Women',
    category: 'Personal Care',
    rating: 4.9,
    reviews: 780,
    description: 'Get a fresh new look with our professional haircut services for women, delivered right to your home. Includes wash, cut, and blow-dry.',
    image: 'https://images.unsplash.com/photo-1595475207225-428b62b0cd33?q=80&w=2070&auto=format&fit=crop',
    features: ['Experienced stylists', 'Personalized consultation', 'Premium products', 'Comfort of your home'],
    plans: [
      { id: 1, name: 'Basic Haircut', price: 60, desc: 'Wash, cut, and blow-dry.' },
      { id: 2, name: 'Haircut & Styling', price: 90, desc: 'Haircut with advanced styling.' }
    ],
    customerReviews: [
      { id: 1, user: 'Jessica A.', rating: 5, comment: 'My stylist was amazing! Loved my new haircut.' }
    ]
  },
  {
    id: 30,
    title: 'Haircut & Shave for Men',
    category: 'Personal Care',
    rating: 4.7,
    reviews: 620,
    description: 'Classic haircuts and traditional shaves for men. Experience grooming excellence at your doorstep with our skilled barbers.',
    image: 'https://images.unsplash.com/photo-1555804245-a7732865910c?q=80&w=2070&auto=format&fit=crop',
    features: ['Professional barbers', 'Hot towel shave', 'Beard trimming', 'Quality grooming products'],
    plans: [
      { id: 1, name: 'Haircut Only', price: 40, desc: 'Standard haircut service.' },
      { id: 2, name: 'Haircut & Shave', price: 70, desc: 'Haircut with a classic hot towel shave.' }
    ],
    customerReviews: [
      { id: 1, user: 'Mark T.', rating: 4, comment: 'Great haircut, but the shave was a bit rushed.' }
    ]
  },
  {
    id: 31,
    title: 'Facial & Skincare',
    category: 'Personal Care',
    rating: 4.8,
    reviews: 510,
    description: 'Rejuvenate your skin with our range of facial and skincare treatments. Customized to your skin type for a healthy glow.',
    image: 'https://images.unsplash.com/photo-1590439471361-31f0f0c0f1b2?q=80&w=2070&auto=format&fit=crop',
    features: ['Skin analysis', 'Customized treatments', 'Premium skincare products', 'Relaxing experience'],
    plans: [
      { id: 1, name: 'Basic Facial', price: 70, desc: 'Cleansing, exfoliation, and mask.' },
      { id: 2, name: 'Anti-Aging Facial', price: 110, desc: 'Deep cleansing with anti-aging serums.' }
    ],
    customerReviews: [
      { id: 1, user: 'Olivia P.', rating: 5, comment: 'My skin feels amazing after the facial. Highly recommend!' }
    ]
  },
  {
    id: 32,
    title: 'Spa & Body Treatments',
    category: 'Personal Care',
    rating: 4.9,
    reviews: 380,
    description: 'Indulge in luxurious spa and body treatments designed to relax and revitalize. From body scrubs to wraps, experience ultimate pampering.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa93e?q=80&w=2070&auto=format&fit=crop',
    features: ['Relaxing ambiance', 'Natural ingredients', 'Experienced therapists', 'Full body rejuvenation'],
    plans: [
      { id: 1, name: 'Body Scrub', price: 120, desc: 'Exfoliating body scrub for smooth skin.' },
      { id: 2, name: 'Body Wrap', price: 180, desc: 'Detoxifying and hydrating body wrap.' }
    ],
    customerReviews: [
      { id: 1, user: 'Sophia L.', rating: 5, comment: 'The body wrap was heavenly. Felt completely refreshed.' }
    ]
  },
  {
    id: 33,
    title: 'Hair Styling & Treatment',
    category: 'Personal Care',
    rating: 4.7,
    reviews: 450,
    description: 'Transform your hair with our professional styling and treatment services. From blowouts to deep conditioning, we cater to all your hair needs.',
    image: 'https://images.unsplash.com/photo-1536109352652-321712211d13?q=80&w=2070&auto=format&fit=crop',
    features: ['Trendy styles', 'Deep conditioning', 'Hair coloring', 'Expert advice'],
    plans: [
      { id: 1, name: 'Blowout & Style', price: 90, desc: 'Professional blow-dry and styling.' },
      { id: 2, name: 'Deep Conditioning', price: 130, desc: 'Intensive hair repair treatment.' }
    ],
    customerReviews: [
      { id: 1, user: 'Chloe B.', rating: 4, comment: 'My hair looked great, but the treatment took longer than expected.' }
    ]
  },
  {
    id: 34,
    title: 'Nail Care (Mani/Pedi)',
    category: 'Personal Care',
    rating: 4.6,
    reviews: 590,
    description: 'Pamper your hands and feet with our comprehensive nail care services. Enjoy manicures, pedicures, and nail art in the comfort of your home.',
    image: 'https://images.unsplash.com/photo-1584969214435-031899166f36?q=80&w=2070&auto=format&fit=crop',
    features: ['Hygienic tools', 'Wide color selection', 'Relaxing massage', 'Long-lasting finish'],
    plans: [
      { id: 1, name: 'Classic Manicure', price: 50, desc: 'Nail shaping, cuticle care, and polish.' },
      { id: 2, name: 'Deluxe Pedicure', price: 80, desc: 'Foot soak, exfoliation, massage, and polish.' }
    ],
    customerReviews: [
      { id: 1, user: 'Isabella M.', rating: 5, comment: 'My nails look perfect! Very professional and relaxing.' }
    ]
  },
  {
    id: 35,
    title: 'Fitness & Yoga Sessions',
    category: 'Healthcare',
    rating: 4.9,
    reviews: 180,
    description: 'Achieve your wellness goals with personalized fitness and yoga training at home. Our certified trainers design custom workout plans and mindfulness sessions tailored to your fitness level.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop',
    features: ['Certified personal trainers', 'Yoga & Meditation specialists', 'Customized workout plans', 'Equipment guidance'],
    plans: [
      { id: 1, name: 'Single Session', price: 50, desc: '60-minute personalized training or yoga session.' },
      { id: 2, name: 'Monthly Package', price: 450, desc: '12 sessions per month with progress tracking.' }
    ],
    customerReviews: [
      { id: 1, user: 'Michael Scott', rating: 5, comment: 'Great instructor! Really helped me improve my posture and flexibility.' }
    ]
  },
  {
    id: 36,
    title: 'Housemaid booking',
    category: 'Convenience',
    rating: 4.8,
    reviews: 450,
    description: 'Book professional and background-verified housemaids for your daily chores. We offer flexible plans including one-time help or recurring daily service.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',
    features: ['Background verified', 'Experienced professionals', 'Flexible timings', 'Daily or weekly plans'],
    plans: [
      { id: 1, name: 'Daily Visit', price: 15, desc: '4-hour shift for basic cleaning and chores.' },
      { id: 2, name: 'Full Day', price: 30, desc: '8-hour comprehensive domestic help.' }
    ],
    customerReviews: [
      { id: 1, user: 'Angela Martin', rating: 5, comment: 'The maid was punctual and very efficient. Great relief for my busy schedule.' }
    ]
  },
  {
    id: 37,
    title: 'Baby Sitting',
    category: 'Convenience',
    rating: 4.9,
    reviews: 210,
    description: 'Find trusted and caring babysitters for your children. Our sitters are trained in child safety and engagement to provide a secure environment for your little ones.',
    image: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?q=80&w=2070&auto=format&fit=crop',
    features: ['Child safety trained', 'Background checked', 'Activity planning', 'First-aid aware'],
    plans: [
      { id: 1, name: 'Hourly Care', price: 25, desc: 'On-demand sitting for a few hours.' },
      { id: 2, name: 'Evening Shift', price: 80, desc: 'Care for the whole evening (4-5 hours).' }
    ],
    customerReviews: [
      { id: 1, user: 'Jim Halpert', rating: 5, comment: 'Very reliable and good with kids. My daughter loved the activities planned by the sitter.' }
    ]
  },
  {
    id: 38,
    title: 'DJ/Music Service',
    category: 'Events',
    rating: 4.8,
    reviews: 155,
    description: 'Professional DJ services for all types of events. We provide top-quality sound systems, lighting, and a vast music library to keep your guests entertained and the dance floor busy.',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?q=80&w=2073&auto=format&fit=crop',
    features: ['Professional sound system', 'Party lighting', 'Extensive music library', 'Custom playlist support'],
    plans: [
      { id: 1, name: 'Standard Set', price: 200, desc: '4-hour DJ performance with sound system.' },
      { id: 2, name: 'Premium Set', price: 400, desc: 'Full event coverage with DJ, premium sound, and lighting.' }
    ],
    customerReviews: [
      { id: 1, user: 'Kelly R.', rating: 5, comment: 'Amazing DJ! Played exactly what we wanted and kept the energy high all night.' }
    ]
  },
];
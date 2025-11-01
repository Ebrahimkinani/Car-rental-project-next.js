"use client"

import { AnimatedTestimonials, Testimonial } from "@/components/blocks/animated-testimonials"

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Hassan",
    role: "Business Owner",
    company: "Tech Solutions Inc.",
    content: "The best car rental experience I've ever had! Their fleet is amazing and the booking process is incredibly smooth. I've been using their services for my business trips for over a year now.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Project Manager",
    company: "Digital Innovations",
    content: "Outstanding service and the most professional team. They always have the perfect vehicle for my needs. The online booking system is user-friendly and the cars are always in excellent condition.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 3,
    name: "Mohammed Al-Rashid",
    role: "Sales Director",
    company: "Global Trading Co.",
    content: "I highly recommend this service to anyone looking for reliable car rentals. The customer support team is responsive, and I love how easy it is to find and book the perfect car for any occasion.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 4,
    name: "Emma Wilson",
    role: "Marketing Executive",
    company: "Creative Agency",
    content: "The variety of cars available is impressive! From luxury vehicles to affordable options, they have everything. The pricing is transparent and competitive. A trusted partner for all our transportation needs.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 5,
    name: "David Chen",
    role: "Entrepreneur",
    company: "Startup Hub",
    content: "What impressed me most is their attention to detail and customer satisfaction. Every interaction has been pleasant, and they always go the extra mile to ensure everything is perfect.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 6,
    name: "Fatima Abdullah",
    role: "Consultant",
    company: "Business Advisory",
    content: "Exceptionally professional service with a wide selection of premium vehicles. The booking process is straightforward, and the support team is always available to help. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=faces"
  }
]

const trustedCompanies = [
  "Tech Giants",
  "Fortune 500",
  "Startups",
  "Enterprise",
]

export default function CustomerTestimonials() {
  return (
    <AnimatedTestimonials
      title="What Our Customers Say"
      subtitle="Don't just take our word for it. See what our valued customers have to say about their experiences with our car rental service."
      badgeText="5-Star Rated Service"
      testimonials={testimonials}
      autoRotateInterval={4000}
      trustedCompanies={trustedCompanies}
      trustedCompaniesTitle="Trusted by professionals worldwide"
      className="bg-gray-50"
    />
  )
}


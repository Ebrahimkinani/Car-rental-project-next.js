"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const teamMembers = [
  {
    name: "Ahmed Al-Mansoori",
    designation: "CEO & Founder",
    quote: "I started RentCar to make car rental accessible and transparent for everyone. Our mission is to deliver exceptional service with innovation at our core.",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face",
  },
  {
    name: "Fatima Hassan",
    designation: "Head of Operations",
    quote: "Ensuring every vehicle in our fleet meets the highest standards of cleanliness and reliability is my passion. We treat every car as if it were our own.",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop&crop=face",
  },
  {
    name: "Mohamed Ibrahim",
    designation: "Customer Success Manager",
    quote: "Our customers' happiness is our top priority. I work with an amazing team to provide 24/7 support and ensure every rental experience exceeds expectations.",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face",
  },
  {
    name: "Sarah Al-Attiyah",
    designation: "Technology Lead",
    quote: "We're constantly innovating to improve our booking platform and customer experience. Technology should make rental easy, intuitive, and seamless.",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face",
  },
  {
    name: "Khalid Al-Thani",
    designation: "Fleet Manager",
    quote: "With over 1,200 vehicles in our fleet, I ensure every car is maintained to perfection. Quality and safety are non-negotiable in everything we do.",
    src: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=500&h=500&fit=crop&crop=face",
  },
  {
    name: "Aisha Al-Suwaidi",
    designation: "Sustainability Officer",
    quote: "Protecting our planet is everyone's responsibility. I'm proud to lead our green initiatives and help customers make eco-friendly choices.",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop&crop=face",
  },
];

export function OurTeam() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate professionals behind RentCar who work tirelessly to deliver exceptional service
          </p>
        </div>

        <AnimatedTestimonials testimonials={teamMembers} autoplay={true} />
      </div>
    </section>
  );
}


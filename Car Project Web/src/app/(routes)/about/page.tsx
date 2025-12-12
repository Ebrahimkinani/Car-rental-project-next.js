// app/about/page.tsx
"use client";

import { ShieldCheck, Clock, Phone, Leaf, Sparkles } from "lucide-react";
import { JourneyTimeline } from "@/components/timeline/JourneyTimeline";
import { OurTeam } from "@/components/shared/OurTeam";
import { FleetJourney } from "@/components/blocks/FleetJourney";

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <p className="text-xs uppercase tracking-widest text-gray-500">About us</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            We make renting a car
            <span className="block text-gray-500">simple, fast, and reliable.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Since day one, our goal has been to remove friction from mobility. Whether it’s a weekend drive,
            a business trip, or a month-long stay, we deliver clean, fully insured vehicles with transparent
            pricing and support that actually answers.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
         
            <a
              href="/contact"
              className="inline-flex items-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:scale-105 transition-transform"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
       {/* Journey Timeline */}
       <JourneyTimeline />

   

{/* Fleet highlights */}
<section className="bg-gradient-to-br from-gray-50 to-white">
  <FleetJourney />
</section>

      {/* Trust bar */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 ">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Why choose RentCar?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Trusted by thousands of customers with our commitment to excellence</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem 
              icon={<ShieldCheck className="h-6 w-6" />} 
              title="Fully insured" 
              description="Comprehensive coverage included"
              color="text-primary-600"
              bgColor="bg-primary-50"
            />
            <TrustItem 
              icon={<Clock className="h-6 w-6" />} 
              title="24/7 roadside help" 
              description="Always here when you need us"
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <TrustItem 
              icon={<Sparkles className="h-6 w-6" />} 
              title="Sanitized every trip" 
              description="Clean and safe for your peace of mind"
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            <TrustItem 
              icon={<Leaf className="h-6 w-6" />} 
              title="Eco-friendly options" 
              description="Sustainable choices for the planet"
              color="text-emerald-600"
              bgColor="bg-emerald-50"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <Stat label="Active vehicles" value="1,200+" />
            <Stat label="On-time deliveries" value="98.4%" />
            <Stat label="Avg. rating" value="4.9/5" />
          </div>
        </div>
      </section>

     


      {/* Contact & CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid items-center gap-8 rounded-2xl border p-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">Talk to a human</h2>
              <p className="mt-3 text-gray-600">
                Have questions about insurance, long-term rentals, or airport delivery? Our team is here 24/7.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <a href="/contact" className="inline-flex items-center rounded-xl bg-gray-900 px-4 py-2 font-medium text-white hover:scale-105 transition-transform">Contact us</a>
                <a href="tel:+974 7158 4173" className="inline-flex items-center rounded-xl border px-4 py-2 font-medium hover:bg-gray-50 transition"> <Phone className="mr-2 h-4 w-4" /> +974 7158 4173 </a>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3"><ShieldCheck className="mt-1 h-5 w-5" /> Comprehensive insurance included</li>
              <li className="flex items-start gap-3"><Clock className="mt-1 h-5 w-5" /> Flexible extensions & instant deposits</li>
            </ul>
          </div>
          <p className="mt-12 text-center text-xs text-gray-500">© {new Date().getFullYear()} RentCar. All rights reserved.</p>
        </div>
      </section>
         {/* Our Team */}
         <OurTeam />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-6 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-gray-300">
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-gray-600">{label}</p>
    </div>
  );
}



function TrustItem({ 
  icon, 
  title, 
  description, 
  color, 
  bgColor 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string; 
  bgColor: string; 
}) {
  return (
    <div className="group text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${bgColor} ${color} mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

"use client";

import { Timeline } from "@/components/ui/timeline";
import { Car, Sparkles } from "lucide-react";
import { OurVision } from "./OurVision";

export function JourneyTimeline() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Timeline 
          data={[
            {
              title: "Our Mission",
              content: (
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-4">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">Our Mission</h4>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    We believe that mobility should be effortless, transparent, and accessible to everyone. 
                    Our mission is to transform the car rental experience by putting drivers first in everything we do.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Innovation:</span> We leverage cutting-edge technology to eliminate friction from every interaction
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Transparency:</span> No hidden fees, no surprises—just honest pricing and clear communication
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Sustainability:</span> Building a greener future with our expanding electric and hybrid fleet
                      </p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              title: "Our Story",
              content: (
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">Our Story</h4>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    What started as a simple idea to make car rentals better has grown into a movement 
                    that&apos;s changing how people think about mobility. Every milestone has been driven by 
                    our commitment to exceptional service.
                  </p>
                </div>
              )
            },
            {
              title: "Our Vision",
              content: (
                <OurVision />
              )
            },
            {
              title: "2019",
              content: (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-2xl">The Beginning</h4>
                  <p className="text-gray-600 text-base">
                    Launched with just 20 vehicles and a big dream to revolutionize car rentals. 
                    Started with a simple goal: make renting a car as easy as possible.
                  </p>
                </div>
              )
            },
            {
              title: "2021",
              content: (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-2xl">Innovation Breakthrough</h4>
                  <p className="text-gray-600 text-base">
                    Introduced contactless pickup and digital-first experience during the pandemic. 
                    Expanded to 500+ vehicles across major cities.
                  </p>
                </div>
              )
            },
            {
              title: "2023",
              content: (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-2xl">Electric Fleet Launch</h4>
                  <p className="text-gray-600 text-base">
                    Pioneered the introduction of our eco-friendly electric and hybrid vehicles. 
                    Reached 50+ electric vehicles and growing.
                  </p>
                </div>
              )
            },
            {
              title: "2024",
              content: (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-2xl">Expansion & Growth</h4>
                  <p className="text-gray-600 text-base">
                    Expanded to airport delivery, long-term rentals, and introduced premium concierge service. 
                    Now serving 1,200+ vehicles nationwide with a customer satisfaction rate of 98.4%.
                  </p>
                </div>
              )
            }
          ]}
        />
      </div>
    </section>
  );
}


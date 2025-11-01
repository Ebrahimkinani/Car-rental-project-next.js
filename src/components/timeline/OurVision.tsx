"use client";

import Link from "next/link";
import { Car, ShieldCheck, Leaf, Sparkles } from "lucide-react";

export function OurVision() {
  return (
    <div className="bg-white rounded-3xl p-12 border-2 border-gray-200">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-linear-to-r from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-4xl font-bold text-gray-900">Our Vision</h3>
      </div>
      <p className="text-xl leading-relaxed max-w-4xl mx-auto text-gray-700 mb-8">
        To become the world&apos;s most trusted mobility platform, where every journey begins with confidence 
        and ends with satisfaction. We envision a future where car rental is as simple as ordering a ride.
      </p>
      
      {/* Vision Pillars */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Car className="h-6 w-6 text-primary-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Seamless Mobility</h4>
          <p className="text-gray-600 text-sm">
            Making transportation effortless through innovative technology and user-friendly experiences
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Trust & Safety</h4>
          <p className="text-gray-600 text-sm">
            Building confidence through transparent practices, comprehensive insurance, and reliable service
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Sustainable Future</h4>
          <p className="text-gray-600 text-sm">
            Leading the transition to eco-friendly transportation with our expanding electric fleet
          </p>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-lg text-gray-600 mb-6">
          Join us in shaping the future of mobility
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cars"
            className="inline-flex items-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:scale-105 transition-transform"
          >
            Explore Our Fleet
          </Link>
          <a
            href="/contact"
            className="inline-flex items-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Partner With Us
          </a>
        </div>
      </div>
    </div>
  );
}


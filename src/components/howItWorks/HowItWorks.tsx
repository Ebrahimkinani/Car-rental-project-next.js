"use client";

import Image from "next/image";
// import { ArrowUpRightIcon } from "@heroicons/react/24/outline"; // ✅ Built-in Heroicon

export default function HowItWorks() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center px-6 md:px-0">
        {/* Image - First on mobile, second on desktop */}
        <div className="w-full rounded-2xl overflow-hidden order-1 md:order-2">
          <Image
            src="/images/cars/how.png"
            alt=""
            width={1000}
            height={600}
            className="object-cover w-full h-full rounded-2xl"
          />
        </div>

        {/* Text Content - Second on mobile, first on desktop */}
        <div className="space-y-6 order-2 md:order-1">
          <p className="text-sm text-primary-500">• How it works</p>

          <h2 className="text-[28px] font-semibold leading-tight text-gray-900">
            Rent your dream car <br /> in only 3 simple steps
          </h2>

          {/* Steps */}
          <div className="space-y-4">
            <Step
              number="(01)"
              title="Choose your car"
              description="Browse our wide selection of vehicles and pick the car that best suits your needs and style."
            />
            <Divider />
            <Step
              number="(02)"
              title="Select your dates "
              description="Pick your preferred pickup and drop-off dates and locations, then confirm your reservation details."
            />
            <Divider />
            <Step
              number="(03)"
              title="Pick up and enjoy"
              description="Collect your car on the selected date, hit the road, and enjoy a smooth and comfortable drive."
            />
          </div>

          {/* Button */}
          <button
            onClick={() => {
              const carGridElement = document.getElementById('car-grid');
              if (carGridElement) {
                carGridElement.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }}
            className="mt-8 inline-flex items-center gap-2 border border-primary-500 rounded-full px-6 py-3 text-sm font-medium text-primary-500 hover:bg-primary-50 hover:border-primary-600 transition"
          >
            Discover More
            <span className="flex items-center justify-center bg-primary-500 text-white rounded-full w-6 h-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Helper Components ---------------- */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
        <span className="text-primary-500">{number}</span>
        <span className="text-primary-500">{title}</span>
        
      </h3>
      {description && (
        <p className="text-sm text-gray-500 pl-8 mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function Divider() {
  return <div className="border-b border-gray-200 my-4" />;
}

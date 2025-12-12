"use client";

import { Car } from "@/types";
import { cn } from "@/lib/utils";

interface RentalTermsProps {
  car: Car;
  className?: string;
}

export default function RentalTerms({ car, className }: RentalTermsProps) {
  const terms = [
    {
      title: "Rental Requirements",
      items: [
        "Valid driver's license required",
        "Age requirement: 25+ years",
        "Credit card authorization required",
        "International license accepted"
      ]
    },
    {
      title: "Included Services",
      items: [
        car.unlimitedMileage ? "Unlimited mileage" : "Standard mileage included",
        car.insuranceIncluded ? "Insurance coverage included" : "Basic insurance included",
        "24/7 roadside assistance",
        "Free pickup and return"
      ]
    },
    {
      title: "Cancellation Policy",
      items: [
        "Free cancellation up to 24 hours before pickup",
        "50% refund for cancellations within 24 hours",
        "No refund for no-shows",
        "Weather-related cancellations fully refunded"
      ]
    }
  ];

  return (
    <div className={cn("bg-gray-100 rounded-2xl border border-gray-300 p-6", className)}>
      <h3 className="text-xl font-bold text-black mb-6">
        Rental Terms & Conditions
      </h3>
      
      <div className="space-y-6">
        {terms.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="text-lg font-semibold text-black mb-3">
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-black">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Additional Terms */}
      <div className="mt-6 pt-6 border-t border-gray-400">
        <h4 className="text-lg font-semibold text-black mb-3">
          Important Notes
        </h4>
        <div className="space-y-2 text-sm text-black">
          <p>• Vehicle must be returned in the same condition as received</p>
          <p>• Fuel tank should be returned at the same level as pickup</p>
          <p>• Smoking is not permitted in any of our vehicles</p>
          <p>• Pets are allowed with prior notice and additional cleaning fee</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-6 pt-6 border-t border-gray-400">
        <div className="flex items-center gap-2 text-sm text-black">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span>Questions? Call us at (+974) 7158 4173</span>
        </div>
      </div>
    </div>
  );
}

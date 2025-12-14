"use client";

import { PaymentFormData } from "@/types";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  value: PaymentFormData["paymentMethod"];
  onChange: (method: PaymentFormData["paymentMethod"]) => void;
  className?: string;
}

const paymentMethods = [
  {
    id: "card" as const,
    name: "Credit/Debit Card",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
      </svg>
    ),
  },
  {
    id: "paypal" as const,
    name: "PayPal",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.676c-.95-.99-2.38-1.35-4.16-1.35H8.89c-.524 0-.968.382-1.05.9L6.4 19.337h4.676c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287z"/>
      </svg>
    ),
  },
  {
    id: "apple_pay" as const,
    name: "Apple Pay",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  {
    id: "google_pay" as const,
    name: "Google Pay",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L13.5 12l4.198-2.491zM5.864 2.658L18.135 12 5.864 21.342l-.31-.18V2.838l.31-.18z"/>
      </svg>
    ),
  },
];

export default function PaymentMethodSelector({ value, onChange, className }: PaymentMethodSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h4 className="text-lg font-semibold text-black mb-3">
        Payment Method
      </h4>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={cn(
              "flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
              value === method.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={value === method.id}
              onChange={(e) => onChange(e.target.value as PaymentFormData["paymentMethod"])}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <div className={cn(
                "text-gray-600",
                value === method.id && "text-primary-600"
              )}>
                {method.icon}
              </div>
              <span className={cn(
                "font-medium",
                value === method.id ? "text-primary-900" : "text-gray-900"
              )}>
                {method.name}
              </span>
            </div>
            {value === method.id && (
              <div className="ml-auto">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

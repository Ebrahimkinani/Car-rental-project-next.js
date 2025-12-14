"use client";

import { useState } from "react";
import { PaymentFormData } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
  className?: string;
}

export default function PaymentForm({ onSubmit, isLoading = false, className }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: "card",
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
  });

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => {
        const parentValue = prev[parent as keyof PaymentFormData];
        return {
          ...prev,
          [parent]: {
            ...(typeof parentValue === 'object' ? parentValue : {}),
            [child]: value,
          },
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field as keyof PaymentFormData]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
      if (!formData.cardholderName) newErrors.cardholderName = "Cardholder name is required";
      if (!formData.expiryMonth) newErrors.expiryMonth = "Expiry month is required";
      if (!formData.expiryYear) newErrors.expiryYear = "Expiry year is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";

      const addressErrors: any = {};
      if (!formData.billingAddress.street) addressErrors.street = "Street address is required";
      if (!formData.billingAddress.city) addressErrors.city = "City is required";
      if (!formData.billingAddress.state) addressErrors.state = "State is required";
      if (!formData.billingAddress.zipCode) addressErrors.zipCode = "ZIP code is required";
      
      if (Object.keys(addressErrors).length > 0) {
        newErrors.billingAddress = addressErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Utility function for future use
  // const formatCardNumber = (value: string) => {
  //   return value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
  // };

  return (
    <div className={cn("bg-gray-100 rounded-2xl border border-gray-300 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-black mb-2">
          Payment Details
        </h3>
        <p className="text-sm text-gray-600">
          Complete your booking with secure payment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <PaymentMethodSelector
          value={formData.paymentMethod}
          onChange={(method) => handleInputChange("paymentMethod", method)}
        />

        {/* Card Details - Only show for card payment */}
        {formData.paymentMethod === "card" && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">
              Card Information
            </h4>
            
            {/* Card Number */}
            <Input
              label="Card Number"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(value) => handleInputChange("cardNumber", value.replace(/\D/g, ""))}
              error={errors.cardNumber}
              required
            />

            {/* Cardholder Name */}
            <Input
              label="Cardholder Name"
              type="text"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={(value) => handleInputChange("cardholderName", value)}
              error={errors.cardholderName}
              required
            />

            {/* Expiry and CVV */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Month
                </label>
                <select
                  value={formData.expiryMonth}
                  onChange={(e) => handleInputChange("expiryMonth", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.expiryMonth && (
                  <p className="text-sm text-red-600 mt-1">{errors.expiryMonth}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Year
                </label>
                <select
                  value={formData.expiryYear}
                  onChange={(e) => handleInputChange("expiryYear", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.expiryYear && (
                  <p className="text-sm text-red-600 mt-1">{errors.expiryYear}</p>
                )}
              </div>
              <div>
                <Input
                  label="CVV"
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(value) => handleInputChange("cvv", value.replace(/\D/g, "").slice(0, 4))}
                  error={errors.cvv}
                  required
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">
                Billing Address
              </h4>
              
              <Input
                label="Street Address"
                type="text"
                placeholder="123 Main Street"
                value={formData.billingAddress.street}
                onChange={(value) => handleInputChange("billingAddress.street", value)}
                error={errors.billingAddress?.street}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  placeholder="New York"
                  value={formData.billingAddress.city}
                  onChange={(value) => handleInputChange("billingAddress.city", value)}
                  error={errors.billingAddress?.city}
                  required
                />
                <Input
                  label="State"
                  type="text"
                  placeholder="NY"
                  value={formData.billingAddress.state}
                  onChange={(value) => handleInputChange("billingAddress.state", value)}
                  error={errors.billingAddress?.state}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP Code"
                  type="text"
                  placeholder="10001"
                  value={formData.billingAddress.zipCode}
                  onChange={(value) => handleInputChange("billingAddress.zipCode", value)}
                  error={errors.billingAddress?.zipCode}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={formData.billingAddress.country}
                    onChange={(e) => handleInputChange("billingAddress.country", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Payment Methods */}
        {formData.paymentMethod !== "card" && (
          <div className="text-center py-8">
            <div className="text-gray-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium">
                {formData.paymentMethod === "paypal" && "PayPal Integration Coming Soon"}
                {formData.paymentMethod === "apple_pay" && "Apple Pay Integration Coming Soon"}
                {formData.paymentMethod === "google_pay" && "Google Pay Integration Coming Soon"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please select Credit/Debit Card for now
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? "Processing Payment..." : "Complete Payment"}
        </Button>

        {/* Security Notice */}
        <div className="text-xs text-gray-600 text-center">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </form>
    </div>
  );
}

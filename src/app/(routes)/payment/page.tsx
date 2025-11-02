"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingSummaryData, PaymentFormData } from "@/types";
import BookingSummary from "@/components/payment/BookingSummary";
import PaymentForm from "@/components/payment/PaymentForm";
import { Button } from "@/components/ui/Button";

// Fallback booking data if no data is provided
const defaultBookingData: BookingSummaryData = {
  carId: "",
  carName: "BMW 3 Series",
  carModel: "2023 BMW 330i",
  rentalDays: 3,
  dailyRate: 89,
  totalAmount: 267,
  pickupDate: "2024-01-15",
  returnDate: "2024-01-18",
  pickupLocation: "Downtown Location",
};

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<BookingSummaryData>(defaultBookingData);

  useEffect(() => {
    // Get booking data from URL parameters
    const bookingParam = searchParams.get('booking');
    if (bookingParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(bookingParam));
        setBookingData(parsedData);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        // Keep default data if parsing fails
      }
    }
  }, [searchParams]);

  const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
    setIsProcessing(true);
    
    try {
      // Create booking in database
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          carId: bookingData.carId,
          pickupDate: bookingData.pickupDate,
          returnDate: bookingData.returnDate,
          pickupLocation: bookingData.pickupLocation,
          returnLocation: bookingData.returnLocation,
          pickupTime: bookingData.pickupTime,
          returnTime: bookingData.returnTime,
          rentalDays: bookingData.rentalDays,
          dailyRate: bookingData.dailyRate,
          totalAmount: bookingData.totalAmount,
          notes: bookingData.notes,
          driverAge: bookingData.driverAge,
          additionalDriver: bookingData.additionalDriver,
          insurance: bookingData.insurance
        })
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      void await bookingResponse.json();
      
      // Simulate payment processing
      console.log("Processing payment:", paymentData);
      
      // In a real app, you would:
      // 1. Send payment data to your backend
      // 2. Process payment with payment provider
      // 3. Handle success/error responses
      // 4. Update booking status to confirmed
      
      setTimeout(() => {
        setIsProcessing(false);
        alert("Payment processed successfully! Your booking has been confirmed.");
        // Redirect to bookings page
        router.push('/bookings');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      setIsProcessing(false);
      alert(error instanceof Error ? error.message : 'Failed to create booking. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="py-16 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Car Details
              </Button>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              Complete Your Booking
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Review your booking details and complete your secure payment
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Booking Summary */}
            <div className="space-y-6">
              <BookingSummary data={bookingData} />
              
              {/* Additional Info */}
              <div className="bg-primary-50 rounded-2xl border border-primary-200 p-6">
                <h4 className="text-lg font-semibold text-primary-900 mb-3">
                  What&apos;s Included
                </h4>
                <ul className="space-y-2 text-sm text-primary-800">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited mileage
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic insurance coverage
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    24/7 roadside assistance
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Free cancellation up to 24 hours
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="space-y-6">
              <PaymentForm onSubmit={handlePaymentSubmit} isLoading={isProcessing} />
              
              {/* Security Badge */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    SSL Secured
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    PCI Compliant
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}

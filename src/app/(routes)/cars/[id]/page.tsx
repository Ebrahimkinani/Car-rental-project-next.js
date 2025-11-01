import { notFound } from "next/navigation";
import { Metadata } from "next";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getCarByIdFromStorage } from "@/services/cars/cars.service";  
import CarDetailsHero from "@/components/carDetails/cardetailsPage";
import BookingForm from "@/components/carDetails/BookingForm";
import { Car } from "@/types";

import RelatedCars from "@/components/carDetails/RelatedCars";
import RentalTerms from "@/components/carDetails/RentalTerms";


interface CarDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CarDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const car = await getCarByIdFromStorage(id);

  if (!car) {
    return {
      title: "Car Not Found",
      description: "The requested car could not be found.",
    };
  }

  return {
    title: `${car.name} - Car Rental Details`,
    description: car.description || `Rent the ${car.name} for ${car.price.toLocaleString()} per day. ${car.year ? `Year: ${car.year}` : ""} ${car.fuelType ? `Fuel: ${car.fuelType}` : ""}`,
    openGraph: {
      title: `${car.name} - Car Rental Details`,
      description: car.description || `Rent the ${car.name} for ${car.price.toLocaleString()} per day.`,
      images: car.images.length > 0 ? [car.images[0]] : [],
    },
  };
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const { id } = await params;
  const car = await getCarByIdFromStorage(id);

  if (!car) {
    notFound();
  }

  // Get related cars by fetching all cars and filtering
  // For now, we'll pass an empty array to avoid SSR issues
  // Related cars can be loaded client-side if needed
  const relatedCars: Car[] = [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-14 pb-14">
        <CarDetailsHero car={car} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Additional Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Rental Terms */}
          <div className="lg:col-span-2">
            <RentalTerms car={car} />
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm car={car} />
            </div>
          </div>
        </div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <RelatedCars 
            cars={relatedCars} 
            className="mb-8"
          />
        )}
      </div>
    </div>
  );
}

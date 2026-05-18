import type { Metadata } from "next";
import GridPage from "@/components/carGrid/GridPage";
import { getCars } from "@/lib/cars";

export const metadata: Metadata = {
  title: "Browse Cars",
  description: "Explore our full fleet of rental vehicles.",
};

export default async function CarsListingPage() {
  const cars = await getCars();

  return (
    <>
      <div className="bg-white pt-24 pb-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Browse Our Fleet</h1>
          <p className="mt-2 text-gray-600">
            Compare vehicles, filter by category, and book in minutes.
          </p>
        </div>
      </div>
      <GridPage initialCars={cars} />
    </>
  );
}

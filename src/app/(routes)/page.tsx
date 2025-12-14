import Hero from "@/components/hero/Hero";
import GridPage from "@/components/carGrid/GridPage";
import PopularCarsSection from "@/components/carGrid/PopularCarsSection";
import HowItWorks from "@/components/howItWorks/HowItWorks";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import { getCars } from "@/lib/cars";

// Enable dynamic rendering and set revalidation time
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  // Fetch cars server-side
  const cars = await getCars();
  
  return (
    <main className="min-h-screen bg-white ">
      <Hero />
      <GridPage initialCars={cars} />
      <PopularCarsSection />
      <HowItWorks />
     
      <CustomerTestimonials />
    </main>
  );
}
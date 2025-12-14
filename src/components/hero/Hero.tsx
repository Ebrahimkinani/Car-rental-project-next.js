"use client";

import SliderCard from "./SliderCard2";

export default function Hero() {
  // Outer margins kept consistent and minimal; no shadows anywhere.
  return (
    <section className="relative w-full h-[50vh] md:h-screen bg-white pt-2 px-2 pb-4 sm:pt-3 sm:px-3 sm:pb-6 lg:pt-4 lg:px-4 lg:pb-8">
      {/* Overlap effect: the card visually sits above section flow */}
      <div className="relative h-full">
      

        {/* Center: Headline & CTA - positioned absolutely */}
        <div className="absolute left-1/2 top-20 md:top-1/4 -translate-x-1/2 md:-translate-y-1/2 z-10 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-xs sm:max-w-sm md:max-w-md text-center text-white px-4 sm:px-2">
          <h1 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[48px] font-bold tracking-tight">
            <span className="italic">Luxurious</span> car you can rent from our shop
          </h1>

          
{/* 
          <div className="flex items-center gap-3">
            <Button variant="primary" size="lg">
              Shop Now
            </Button>
            <Button variant="ghost" size="lg">
              Discover
            </Button>
          </div> */}

         
        </div>

        {/* Full screen slider */}
        <SliderCard />
      </div>
    </section>
  );
}

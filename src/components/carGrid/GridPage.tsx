"use client";

import { useState, useMemo, useEffect } from "react";
import CarGrid from "./CarGrid";
import Categories from "./Catogery";
import Search from "../ui/search";
import { Car } from "@/types";
import { getAllCarsFromStorage } from "@/services/cars/cars.service";

interface GridPageProps {
  initialCars?: Car[];
}

// Filter cars based on search criteria
function filterCars(cars: Car[], filters: { carName: string; carModel: string }): Car[] {
  return cars.filter((car) => {
    // Filter by car name (brand or model name)
    const nameMatch = 
      filters.carName === "" || 
      car.brand.toLowerCase().includes(filters.carName.toLowerCase()) ||
      car.name.toLowerCase().includes(filters.carName.toLowerCase()) ||
      car.model.toLowerCase().includes(filters.carName.toLowerCase());

    // Filter by car model year
    const modelMatch = 
      filters.carModel === "" || 
      car.year?.toString() === filters.carModel;

    return nameMatch && modelMatch;
  });
}

export default function Page({ initialCars = [] }: GridPageProps) {
  const [searchFilters, setSearchFilters] = useState<{ carName: string; carModel: string }>({
    carName: "",
    carModel: ""
  });
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [loading, setLoading] = useState(false);

  // Load cars from MongoDB API - run only on client side if no initial cars
  useEffect(() => {
    if (initialCars.length === 0) {
      console.log('GridPage useEffect triggered on client side - no initial cars');
      setLoading(true);
      
      async function loadCars() {
        try {
          console.log('Starting to load cars...');
          const carsData = await getAllCarsFromStorage();
          console.log('Cars data received in GridPage:', carsData);
          console.log('Number of cars loaded:', carsData.length);
          console.log('Cars details:', carsData.map(car => ({ id: car.id, name: car.name, brand: car.brand })));
          setCars(carsData);
        } catch (error) {
          console.error("Error loading cars:", error);
        } finally {
          setLoading(false);
        }
      }
      loadCars();
    } else {
      console.log('Using initial cars from server:', initialCars.length);
    }
  }, [initialCars]);

  // Filter cars based on search criteria
  const filteredCars = useMemo(() => {
    console.log('Filtering cars:', { carsCount: cars.length, filters: searchFilters });
    const filtered = filterCars(cars, searchFilters);
    console.log('Filtered cars:', { filteredCount: filtered.length });
    return filtered;
  }, [cars, searchFilters]);

  const handleSearch = (filters: { carName: string; carModel: string }) => {
    setSearchFilters(filters);
  };

  if (loading) {
    return (
      <main id="car-grid" className="min-h-screen bg-white">
        <div className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-gray-500 text-lg">Loading cars... (Cars: {cars.length})</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="car-grid" className="min-h-screen bg-white ">
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Categories />
          <Search onSearch={handleSearch} />
          
          {/* Search Results Info */}
          {(searchFilters.carName !== "" || searchFilters.carModel !== "") && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Found {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} 
                {searchFilters.carName && ` matching "${searchFilters.carName}"`}
                {searchFilters.carModel && ` from ${searchFilters.carModel}`}
              </p>
            </div>
          )}
          
          {filteredCars.length > 0 ? (
            <CarGrid cars={filteredCars} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {cars.length === 0 ? 'No cars available in database' : 'No cars found matching your search criteria'}
              </div>
              <p className="text-gray-400">
                {cars.length === 0 
                  ? 'Please check if the database connection is working' 
                  : 'Try adjusting your search filters to see more results'
                }
              </p>
              <div className="text-sm text-gray-400 mt-2">
                Total cars loaded: {cars.length} | Filtered cars: {filteredCars.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useMemo, useEffect, use } from "react";
import { notFound } from "next/navigation";
import CarGrid from "@/components/carGrid/CarGrid";
import BrandSearch from "@/components/ui/BrandSearch";
import { getCarsByCategoryFromStorage } from "@/services/cars/cars.service";
import { categoriesApi } from "@/services/api/categories";
import { Car, Category } from "@/types";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
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

export default function CategoryPage({ params }: CategoryPageProps) {
  const [searchFilters, setSearchFilters] = useState<{ carName: string; carModel: string }>({
    carName: "",
    carModel: ""
  });
  const [category, setCategory] = useState<Category | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Unwrap params Promise
  const { slug } = use(params);

  // Load category and cars
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const categoryData = await categoriesApi.getBySlug(slug);
        if (!categoryData) {
          notFound();
          return;
        }
        
        if (mounted) {
          setCategory(categoryData);
        }
        
        const carsData = await getCarsByCategoryFromStorage(categoryData.id);
        if (mounted) {
          setCars(carsData);
        }
      } catch (error) {
        console.error("Error loading category data:", error);
        if (mounted) {
          notFound();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [slug]);

  // Filter cars based on search criteria
  const filteredCars = useMemo(() => {
    return filterCars(cars, searchFilters);
  }, [cars, searchFilters]);

  const handleSearch = (filters: { carName: string; carModel: string }) => {
    setSearchFilters(filters);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-gray-500 text-lg">Loading...</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {category.name} Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              {category.description}
            </p>
            {category.country && (
              <p className="text-sm text-gray-500">
                From {category.country} • Founded {category.founded}
              </p>
            )}
            {category.capacity && (
              <p className="text-sm text-gray-500">
                Capacity: {category.capacity}
              </p>
            )}
          </div>

          {/* Category-Specific Search Component */}
          <BrandSearch onSearch={handleSearch} brandId="" cars={cars} />
          
          {/* Search Results Info */}
          {(searchFilters.carName !== "" || searchFilters.carModel !== "") && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Found {filteredCars.length} {category.name} car{filteredCars.length !== 1 ? 's' : ''} 
                {searchFilters.carName && ` matching "${searchFilters.carName}"`}
                {searchFilters.carModel && ` from ${searchFilters.carModel}`}
              </p>
            </div>
          )}
          
          {filteredCars.length > 0 ? (
            <CarGrid cars={filteredCars} />
          ) : cars.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-600 text-2xl sm:text-3xl font-semibold mb-4 flex items-center justify-center gap-2">
                <span role="img" aria-label="no cars yet">🚗⏳</span>
                oops no car added here yet
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No {category.name} cars found matching your search criteria
              </div>
              <p className="text-gray-400">Try adjusting your search filters to see more results</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

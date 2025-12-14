"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categoriesApi } from "@/services/api/categories";
import { Category } from "@/types";

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const activeCategories = await categoriesApi.getActive();
      setCategories(activeCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    
    // Find the category to get its slug
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      // Navigate to unified category page
      router.push(`/cars/category/${category.slug}`);
    }
  };

  if (loading) {
    return (
      <section className="pb-8 mt-0 pt-0">
        <div className="text-center">
          <div className="text-gray-500">Loading categories...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-8 mt-0 pt-0">
      <div className="text-center mb-6">
        <h2 className="text-[28px] font-semibold mb-4">
          <Link href="/cars/category" className="hover:underline">
            Browse by Category
          </Link>
        </h2>
      </div>

      <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
        <div className="flex gap-4 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`group border rounded-xl px-8 py-3 text-center transition-all duration-300
                         whitespace-nowrap shrink-0 ${
                selectedCategory === category.id
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-gray-800 hover:border-primary-500 hover:text-primary-500"
              }`}
            >
              <div className="font-medium group-hover:text-primary-500">{category.name}</div>
              {(category.country || category.capacity) && (
                <div className="text-xs mt-1 opacity-75 group-hover:text-primary-500">
                  {category.country || category.capacity}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing cars in:{" "}
          <span className="font-semibold">
            {categories.find(c => c.id === selectedCategory)?.name}
          </span>
        </div>
      )}
    </section>
  );
}

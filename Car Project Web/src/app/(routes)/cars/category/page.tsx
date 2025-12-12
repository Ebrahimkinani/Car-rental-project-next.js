"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoriesApi } from "@/services/api/categories";
import { Category } from "@/types";

export default function CategoriesLandingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const active = await categoriesApi.getActive();
        setCategories(active);
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Browse by Category
            </h1>
            <p className="text-gray-600">Select a category to view available cars.</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-500">No categories available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/cars/category/${cat.slug}`}
                  className="group border rounded-xl p-5 hover:shadow-md transition-shadow duration-200 hover:border-primary-500"
                >
                  <div className="flex items-center gap-4">
                    {cat.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-primary-500">{cat.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px] group-hover:text-primary-500">
                        {cat.description}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}



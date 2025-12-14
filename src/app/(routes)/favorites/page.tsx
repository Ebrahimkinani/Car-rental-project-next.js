"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car } from '@/types';
import CarGrid from '@/components/carGrid/CarGrid';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

export default function FavoritesPage() {
  const { getFavorites, clearFavorites, error: favoritesError } = useFavorites();
  const { user, loading: authLoading } = useAuth();
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const combinedError = pageError || favoritesError;
  const isLoading = authLoading || pageLoading;

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setFavoriteCars([]);
      clearFavorites();
      setPageLoading(false);
      setPageError(null);
      return () => {
        isMounted = false;
      };
    }

    const loadFavoriteCars = async () => {
      setPageLoading(true);
      setPageError(null);
      try {
        const cars = await getFavorites();
        if (isMounted) {
          setFavoriteCars(cars);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading favorite cars:', err);
          setPageError(err instanceof Error ? err.message : 'Failed to load favorites');
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    };

    loadFavoriteCars();

    return () => {
      isMounted = false;
    };
  }, [user, getFavorites, clearFavorites]);

  // Show loading state while checking authentication or fetching data
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-28">
        <div className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-gray-500 text-lg">Loading...</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <main className="min-h-screen bg-linear-to-br from-primary-50 to-indigo-100 pt-28">
        <div className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              {/* Hero Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-primary-500 to-indigo-600 rounded-full shadow-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Main Content */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Favorite Cars
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Sign in to save and manage your favorite cars
              </p>
              <p className="text-gray-500 mb-12 max-w-lg mx-auto">
                Create an account or sign in to start building your personal collection of favorite cars. 
                You&apos;ll be able to save cars you love and access them anytime.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-linear-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Create Account
                </Link>
              </div>

              {/* Features List */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Favorites</h3>
                  <p className="text-gray-600">Click the heart icon to save cars you love to your personal collection.</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Access</h3>
                  <p className="text-gray-600">Quickly find and compare your saved cars from one convenient location.</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Sync</h3>
                  <p className="text-gray-600">Your favorites sync across all devices so you never lose your collection.</p>
                </div>
              </div>

              {/* Browse Cars Link */}
              <div className="mt-12">
                <p className="text-gray-500 mb-4">Want to explore our cars first?</p>
                <Link
                  href="/#car-grid"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  Browse All Cars
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show error state if there's an error loading favorites
  if (combinedError) {
    return (
      <main className="min-h-screen bg-white pt-28">
        <div className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">Error loading favorites</div>
              <p className="text-gray-600">{combinedError}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-28">
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Favorite Cars
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover and manage your favorite cars. Click the heart icon to add or remove cars from your favorites.
            </p>
          </div>

          {/* Favorites Grid */}
          {favoriteCars.length > 0 ? (
            <div>
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  You have {favoriteCars.length} favorite car{favoriteCars.length !== 1 ? 's' : ''}
                </p>
              </div>
              <CarGrid cars={favoriteCars} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                {/* Empty Heart Icon */}
                <div className="mb-6">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  No favorites yet
                </h2>
                <p className="text-gray-600 mb-8">
                  Start exploring our cars and click the heart icon to add them to your favorites.
                </p>
                <Link
                  href="/#car-grid"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                >
                  Browse Cars
                  <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

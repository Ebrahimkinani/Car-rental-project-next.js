"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Car } from '@/types';

interface FavoritesContextType {
  favorites: string[]; // Array of car IDs
  addToFavorites: (carId: string) => Promise<void>;
  removeFromFavorites: (carId: string) => Promise<void>;
  isFavorite: (carId: string) => boolean;
  getFavorites: () => Promise<Car[]>;
  loadFavoritesFromServer: () => Promise<void>;
  clearFavorites: () => void;
  loading: boolean;
  error: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from server and sync with local state
  const loadFavoritesFromServer = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/favorites', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, clear favorites
          setFavorites([]);
          return;
        }
        throw new Error('Failed to load favorites');
      }
      
      const favoriteCars = await response.json();
      // Extract car IDs from the favorite cars
      const carIds = favoriteCars.map((car: Car) => car.id);
      setFavorites(carIds);
    } catch (err) {
      console.error('Error loading favorites from server:', err);
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load favorites on mount
  useEffect(() => {
    // Load favorites when the provider mounts
    loadFavoritesFromServer();
  }, [loadFavoritesFromServer]);

  const addToFavorites = useCallback(async (carId: string) => {
    try {
      setError(null);
      console.log('Adding to favorites:', carId);
      
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ carId }),
      });

      console.log('Favorites API response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Favorites API error:', errorData);
        
        if (response.status === 401) {
          throw new Error('Please log in to add favorites');
        }
        throw new Error(errorData.error || 'Failed to add to favorites');
      }

      const result = await response.json();
      console.log('Successfully added to favorites:', result);
      
      // Update local state only if not already in favorites
      setFavorites(prev => {
        if (prev.includes(carId)) {
          return prev; // Already in favorites, don't add duplicate
        }
        return [...prev, carId];
      });
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to add to favorites');
      throw err; // Re-throw so components can handle it
    }
  }, []);

  const removeFromFavorites = useCallback(async (carId: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/favorites/${carId}`, {
        method: 'DELETE',
        credentials: 'include', // Important for cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to manage favorites');
        }
        throw new Error('Failed to remove from favorites');
      }

      setFavorites(prev => prev.filter(id => id !== carId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
      throw err; // Re-throw so components can handle it
    }
  }, []);

  const isFavorite = (carId: string): boolean => {
    return favorites.includes(carId);
  };

  const getFavorites = useCallback(async (): Promise<Car[]> => {
    try {
      setError(null);
      
      const response = await fetch('/api/favorites', {
        credentials: 'include', // Important for cookies
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view favorites');
        }
        throw new Error('Failed to load favorites');
      }
      
      const data: Car[] = await response.json();
      const carIds = data.map((car) => car.id);
      setFavorites(carIds);
      return data; // This returns the full car objects from the API
    } catch (err) {
      console.error('Error getting favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
      throw err;
    }
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setError(null);
  }, []);

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavorites,
    loadFavoritesFromServer,
    clearFavorites,
    loading,
    error,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

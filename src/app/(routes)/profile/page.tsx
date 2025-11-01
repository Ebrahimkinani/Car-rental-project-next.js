/**
 * Profile Page
 * User profile management with authentication guard
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { AccountStats } from '@/components/profile/AccountStats';
import { QuickActions } from '@/components/profile/QuickActions';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { ProfileSidebar, ProfileTab } from '@/components/profile/ProfileSidebar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Load user stats
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      setStatsLoading(true);
      
      // Load favorites count
      const favoritesResponse = await fetch('/api/favorites');
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        setFavoritesCount(favoritesData.data?.length || 0);
      }

      // Load bookings data from API
      const bookingsResponse = await fetch('/api/bookings', {
        credentials: 'include'
      });
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        
        if (Array.isArray(bookingsData)) {
          // Calculate total bookings count
          setBookingsCount(bookingsData.length);
          
          // Calculate total amount spent
          const total = bookingsData.reduce((sum: number, booking: any) => {
            return sum + (booking.totalAmount || 0);
          }, 0);
          setTotalSpent(total);
          
          // Count active bookings (status: confirmed or pending)
          const active = bookingsData.filter((booking: any) => 
            booking.status === 'confirmed' || booking.status === 'pending'
          ).length;
          setActiveBookings(active);
        } else {
          setBookingsCount(0);
          setTotalSpent(0);
          setActiveBookings(0);
        }
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (data: any) => {
    try {
      setUpdateLoading(true);
      await updateProfile(data);
      setIsEditing(false);
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({ 
        type: 'error', 
        message: 'Failed to update profile. Please try again.' 
      });
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {statsLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <>
                <AccountStats 
                  user={user} 
                  favoritesCount={favoritesCount}
                  bookingsCount={bookingsCount}
                  totalSpent={totalSpent}
                  activeBookings={activeBookings}
                />
                <QuickActions 
                  favoritesCount={favoritesCount}
                  bookingsCount={bookingsCount}
                />
              </>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            {isEditing ? (
              <PersonalInfoForm
                user={user}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
                loading={updateLoading}
              />
            ) : (
              <ProfileHeader
                user={user}
                onEditClick={handleEditClick}
                isEditing={isEditing}
              />
            )}
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <SecuritySettings user={user} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg border ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{notification.message}</span>
                <button
                  onClick={() => setNotification(null)}
                  className="ml-4 text-lg font-bold hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

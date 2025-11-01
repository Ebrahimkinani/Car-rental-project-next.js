/**
 * Profile Header Component
 * Displays user avatar, name, email with edit functionality
 */

"use client";

import { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { getUserInitials } from '@/lib/profile-utils';

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
  isEditing?: boolean;
}

export function ProfileHeader({ user, onEditClick, isEditing = false }: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.username || 'User';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.avatar && !imageError ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
                onError={handleImageError}
              />
            ) : (
              getUserInitials(user.firstName, user.lastName, user.username)
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {displayName}
          </h1>
          <p className="text-gray-600 text-lg truncate">
            {user.email}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {user.role === 'admin' ? 'Administrator' : 'Member'}
            </span>
            {user.authProvider && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {user.authProvider === 'google' ? 'Google' : 'Email'}
              </span>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={onEditClick}
            variant="outline"
            size="md"
            disabled={isEditing}
            className="w-full sm:w-auto"
          >
            {isEditing ? 'Editing...' : 'Edit Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}

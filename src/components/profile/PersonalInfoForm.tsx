/**
 * Personal Information Form Component
 * Editable form for user profile information
 */

"use client";

import { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  isValidUsername, 
  isValidName, 
  isValidAvatarUrl,
  calculateProfileCompleteness,
  getProfileCompletionMessage 
} from '@/lib/profile-utils';

interface PersonalInfoFormProps {
  user: User;
  onSave: (data: Partial<User>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function PersonalInfoForm({ user, onSave, onCancel, loading = false }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    avatar: user.avatar || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Calculate profile completeness
  const completeness = calculateProfileCompleteness(formData);

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (value && !isValidName(value)) {
          return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        break;
      case 'username':
        if (!value) {
          return 'Username is required';
        }
        if (!isValidUsername(value)) {
          return 'Username must be 3-20 characters, letters, numbers, and underscores only';
        }
        break;
      case 'avatar':
        if (value && !isValidAvatarUrl(value)) {
          return 'Please enter a valid URL';
        }
        break;
    }
    return '';
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const hasChanges = Object.keys(formData).some(
    key => formData[key as keyof typeof formData] !== (user[key as keyof User] || '')
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Update your personal details and profile information.</p>
      </div>

      {/* Profile Completeness */}
      <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-900">Profile Completeness</span>
          <span className="text-sm font-bold text-primary-900">{completeness}%</span>
        </div>
        <div className="w-full bg-primary-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
        <p className="text-xs text-primary-700 mt-2">
          {getProfileCompletionMessage(completeness)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
            onBlur={() => handleBlur('firstName')}
            error={touched.firstName ? errors.firstName : ''}
            placeholder="Enter your first name"
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleChange('lastName', value)}
            onBlur={() => handleBlur('lastName')}
            error={touched.lastName ? errors.lastName : ''}
            placeholder="Enter your last name"
          />
        </div>

        {/* Username */}
        <Input
          label="Username"
          value={formData.username}
          onChange={(value) => handleChange('username', value)}
          onBlur={() => handleBlur('username')}
          error={touched.username ? errors.username : ''}
          placeholder="Choose a unique username"
          required
        />

        {/* Avatar URL */}
        <Input
          label="Avatar URL"
          type="url"
          value={formData.avatar}
          onChange={(value) => handleChange('avatar', value)}
          onBlur={() => handleBlur('avatar')}
          error={touched.avatar ? errors.avatar : ''}
          placeholder="https://example.com/your-avatar.jpg"
          helperText="Leave empty to use your initials"
        />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!hasChanges || Object.values(errors).some(error => error !== '')}
            className="flex-1 sm:flex-none"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

/**
 * Profile Utilities
 * Helper functions for profile page validation and formatting
 */

/**
 * Safely converts a value to a Date object
 */
export function safeToDate(value: Date | string | number | null | undefined): Date | null {
  if (!value) return null;
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Validates avatar URL format
 */
export function isValidAvatarUrl(url: string): boolean {
  if (!url) return true; // Empty is valid (will use default)
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Formats date for display (e.g., "Member since January 2024")
 */
export function formatMemberSince(date: Date | string | null | undefined): string {
  const dateObj = safeToDate(date);
  
  if (!dateObj) {
    return 'Member since recently';
  }
  
  return `Member since ${dateObj.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })}`;
}

/**
 * Calculates profile completeness percentage
 */
export function calculateProfileCompleteness(user: {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
}): number {
  const fields = ['firstName', 'lastName', 'username', 'avatar'];
  const completedFields = fields.filter(field => {
    const value = user[field as keyof typeof user];
    return value && value.trim() !== '';
  });
  
  return Math.round((completedFields.length / fields.length) * 100);
}

/**
 * Gets initials from user name
 */
export function getUserInitials(firstName?: string, lastName?: string, username?: string): string {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }
  
  if (username) {
    return username.charAt(0).toUpperCase();
  }
  
  return 'U';
}

/**
 * Validates username format
 */
export function isValidUsername(username: string): boolean {
  // Username should be 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validates name fields
 */
export function isValidName(name: string): boolean {
  // Name should be 1-50 characters, letters, spaces, hyphens, and apostrophes only
  const nameRegex = /^[a-zA-Z\s\-']{1,50}$/;
  return nameRegex.test(name.trim());
}

/**
 * Formats profile completion message
 */
export function getProfileCompletionMessage(completeness: number): string {
  if (completeness === 100) {
    return 'Your profile is complete!';
  } else if (completeness >= 75) {
    return 'Almost there! Add a few more details to complete your profile.';
  } else if (completeness >= 50) {
    return 'Your profile is halfway complete. Add more information to help others connect with you.';
  } else {
    return 'Complete your profile to get the most out of your account.';
  }
}

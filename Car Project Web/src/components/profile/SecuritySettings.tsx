/**
 * Security Settings Component
 * Displays security information and account details
 */

"use client";

import { useState } from 'react';
import { User } from '@/types';
import { formatMemberSince, safeToDate } from '@/lib/profile-utils';
import { ChangePasswordModal } from './ChangePasswordModal';

interface SecuritySettingsProps {
  user: User;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handlePasswordChangeSuccess = () => {
    // Password change successful - could add toast notification here
  };
  const securityInfo = [
    {
      label: 'Email Address',
      value: user.email,
      description: 'Your primary email address',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      ),
      isEditable: false,
    },
    {
      label: 'Authentication Method',
      value: user.authProvider === 'google' ? 'Google Account' : 'Email & Password',
      description: 'How you sign in to your account',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      isEditable: false,
    },
    {
      label: 'Account Created',
      value: formatMemberSince(user.createdAt),
      description: 'When you joined our platform',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      isEditable: false,
    },
    {
      label: 'Last Updated',
      value: (() => {
        const dateObj = safeToDate(user.updatedAt);
        if (!dateObj) return 'Never';
        
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      })(),
      description: 'Last time your profile was updated',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      isEditable: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Security & Account</h2>
        <p className="text-gray-600">Your account security information and settings.</p>
      </div>

      <div className="space-y-4">
        {securityInfo.map((info, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg text-gray-600">
              {info.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{info.label}</h3>
                {info.isEditable && (
                  <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                    Change
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-900 font-medium mt-1 truncate">
                {info.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {info.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Tips */}
      <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <h3 className="text-sm font-medium text-primary-900 mb-2">Security Tips</h3>
        <ul className="text-xs text-primary-800 space-y-1">
          <li>• Keep your login credentials secure and don&apos;t share them</li>
          <li>• Use a strong, unique password for your account</li>
          <li>• Log out from shared or public computers</li>
          <li>• Contact support if you notice any suspicious activity</li>
        </ul>
      </div>

      {/* Password Change Button */}
      {user.authProvider === 'email' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button 
            onClick={() => setIsChangePasswordOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change Password
          </button>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
}

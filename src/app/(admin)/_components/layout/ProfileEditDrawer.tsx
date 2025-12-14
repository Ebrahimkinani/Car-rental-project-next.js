"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileEditDrawer({ open, onClose }: Props) {
  const { user, updateProfile, loading } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  if (!open) return null;

  const displayName = user?.firstName || user?.lastName
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || 'User';

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setAvatar(result.data.imageUrl);
      } else {
        alert('Failed to upload image: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      // Reset input value to allow selecting the same file again
      if (event.target) {
        event.target.value = '';
      }
    }
  }

  async function handleSave() {
    if (!user) return;

    try {
      setSaving(true);
      await updateProfile({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        avatar: avatar || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  const canSave = firstName.trim().length > 0 || lastName.trim().length > 0;

  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-auto border-l bg-secondary-gradient p-4 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Edit Profile"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Edit Profile</h2>
          <button className="rounded border px-3 py-1.5 text-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="grid gap-4">
          {/* Avatar Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Profile Picture</h3>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-zinc-200 border-2 border-zinc-300 shrink-0">
                {avatar ? (
                  <Image
                    alt="avatar"
                    src={avatar}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary-500 to-purple-600 text-white text-2xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-xs font-medium text-zinc-600">
                  Upload Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="block w-full text-xs text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 disabled:opacity-50"
                />
                {uploading && <p className="mt-1 text-xs text-zinc-500">Uploading...</p>}
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Personal Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">First Name</label>
                <input
                  className="w-full rounded border p-2 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Last Name</label>
                <input
                  className="w-full rounded border p-2 text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Email</label>
              <input
                className="w-full rounded border p-2 text-sm bg-zinc-100"
                value={user?.email || ""}
                disabled
                placeholder="Email (cannot be changed)"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              className="rounded border px-4 py-2 text-sm hover:bg-zinc-100"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="rounded bg-primary-600 text-white px-4 py-2 text-sm hover:bg-primary-700 disabled:opacity-50"
              onClick={handleSave}
              disabled={!canSave || saving || loading}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


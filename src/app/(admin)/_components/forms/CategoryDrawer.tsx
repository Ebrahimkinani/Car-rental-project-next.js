/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import type { Category } from "@/types";

type Props = {
  open: boolean;
  initial?: Category | null;
  onClose: () => void;
  onSave: (cat: Category) => void;
};

export default function CategoryDrawer({ open, initial, onClose, onSave }: Props) {
  const [model, setModel] = useState<Category>(() =>
    initial ?? ({
      id: `cat-${Date.now()}`,
      name: "",
      code: "",
      slug: "",
      status: "Active",
      imageUrl: ""
    } as Category)
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{ if (open) setModel(initial ?? {
    id: `cat-${Date.now()}`,
    name: "",
    code: "",
    slug: "",
    status: "Active",
    imageUrl: ""
  } as Category); }, [open, initial]);

  if (!open) return null;

  const canSave = model.name.trim().length > 1 && model.code.trim().length >= 2 && model.slug.trim().length >= 2;

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
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch('/api/upload/category-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setModel((m: Category) => ({ ...m, imageUrl: result.data.imageUrl }));
      } else {
        alert('Failed to upload image: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  }

  function handleSave() {
    if (!canSave) return;
    onSave({ ...model, code: model.code.toUpperCase() });
  }

  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-auto border-l bg-secondary-gradient p-4 shadow-lg"
        role="dialog" aria-modal="true" aria-label="Category Editor"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{initial ? "Edit Category" : "New Category"}</h2>
          <button className="rounded border px-3 py-1.5 text-sm" onClick={onClose}>Close</button>
        </div>

        <div className="grid gap-3">
          {/* Basic Category Information */}
          <div className="border-b pb-3">
            <h3 className="text-sm font-medium text-zinc-800 mb-2">Basic Information</h3>
            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Name *</label>
                <input className="w-full rounded border p-2 text-sm"
                  value={model.name} onChange={(e)=>setModel((m: Category)=>({ ...m, name: e.target.value }))}
                  placeholder="e.g., BMW, Mercedes-Benz"/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Code *</label>
                <input className="w-full rounded border p-2 text-sm" placeholder="e.g., BMW, MERCEDES"
                  value={model.code} onChange={(e)=>setModel((m: Category)=>({ ...m, code: e.target.value }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Slug *</label>
                <input className="w-full rounded border p-2 text-sm" placeholder="e.g., bmw, mercedes-benz"
                  value={model.slug} onChange={(e)=>setModel((m: Category)=>({ ...m, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Status</label>
                <select className="w-full rounded border p-2 text-sm"
                  value={model.status}
                  onChange={(e)=>setModel((m: Category)=>({ ...m, status: e.target.value as Category["status"] }))}>
                  <option>Active</option>
                  <option>Hidden</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-sm font-medium text-zinc-800 mb-2">Image</h3>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Category Image</label>
              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  {model.imageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={model.imageUrl}
                        alt="Category preview"
                        className="mx-auto h-24 w-24 object-cover rounded-lg"
                      />
                      <p className="text-xs text-zinc-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto h-12 w-12 text-zinc-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xs text-zinc-600">Click to upload image</p>
                      <p className="text-xs text-zinc-500">PNG, JPG up to 2MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded border px-3 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-50"
            onClick={handleSave} disabled={!canSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
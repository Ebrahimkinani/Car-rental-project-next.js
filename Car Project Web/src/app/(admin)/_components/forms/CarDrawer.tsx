/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import type { Car } from "../types/car";
import type { Category } from "@/types";
import { categoriesApi } from "@/services/api/categories";

type Props = {
  open: boolean;
  initial?: Car | null;
  onClose: () => void;
  onSave: (car: Car) => void;
};

export default function CarDrawer({ open, initial, onClose, onSave }: Props) {
  const [model, setModel] = useState<Car>(() =>
    initial ?? ({
      id: `car-${Date.now()}`,
      name: "",
      model: "",
      brand: "",
      brandId: "",
      categoryId: "",
      description: "",
      price: 0,
      weeklyRate: undefined,
      weeklyRateEnabled: false,
      monthlyRate: undefined,
      seats: 5,
      doors: 4,
      luggageCapacity: undefined,
      engineType: "",
      horsepower: undefined,
      acceleration: undefined,
      topSpeed: undefined,
      images: [],
      year: new Date().getFullYear(),
      location: "",
      mileage: 0,
      fuelType: "gasoline",
      transmission: "automatic",
      color: "",
      features: [],
      available: true,
      status: "available",
      vin: "",
      licensePlate: "",
      branch: "Doha",
      rentalTerms: [],
      cancellationPolicy: "",
      isPopular: false,
      popularSince: null,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Car)
  );
  
  const [brands, setBrands] = useState<Category[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Load brands when drawer opens
  useEffect(() => {
    if (open) {
      loadBrands();
      if (initial) {
        setModel(initial);
      } else {
        // Reset form for new car
        setModel({
          id: `car-${Date.now()}`,
          name: "",
          model: "",
          brand: "",
          brandId: "",
          categoryId: "",
          description: "",
          price: 0,
          weeklyRate: undefined,
          weeklyRateEnabled: false,
          monthlyRate: undefined,
          seats: 5,
          doors: 4,
          luggageCapacity: undefined,
          engineType: "",
          horsepower: undefined,
          acceleration: undefined,
          topSpeed: undefined,
          images: [],
          year: new Date().getFullYear(),
          location: "",
          mileage: 0,
          fuelType: "gasoline",
          transmission: "automatic",
          color: "",
          features: [],
          available: true,
          status: "available",
          vin: "",
          licensePlate: "",
          branch: "Doha",
          rentalTerms: [],
          cancellationPolicy: "",
          isPopular: false,
          popularSince: null,
          createdAt: new Date(),
          updatedAt: new Date()
        } as Car);
      }
    }
  }, [open, initial]);

  const loadBrands = async () => {
    try {
      const activeBrands = await categoriesApi.getActive();
      setBrands(activeBrands);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  if (!open) return null;

  const canSave = model.name.trim().length > 1 && 
                  model.model.trim().length > 1 && 
                  (model.brandId || model.categoryId) && 
                  model.price > 0 &&
                  model.seats > 0 &&
                  model.doors > 0;

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development' && !canSave) {
    // eslint-disable-next-line no-console
    console.warn('[CarDrawer] Save button disabled:', {
      name: model.name,
      nameLength: model.name.trim().length,
      model: model.model,
      modelLength: model.model.trim().length,
      brandId: model.brandId,
      categoryId: model.categoryId,
      price: model.price,
      seats: model.seats,
      doors: model.doors,
      brandsCount: brands.length,
      canSave
    });
  }

  function handleSave() {
    if (!canSave) return;
    
    // Validate required fields
    if (!model.name.trim()) {
      alert('Name is required');
      return;
    }
    if (!model.model.trim()) {
      alert('Model is required');
      return;
    }
    const categoryId = model.categoryId || model.brandId;
    if (!categoryId || categoryId.trim() === '') {
      alert('Please select a brand');
      return;
    }
    if (!model.price || model.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    if (!model.seats || model.seats <= 0) {
      alert('Seats must be greater than 0');
      return;
    }
    if (!model.doors || model.doors <= 0) {
      alert('Doors must be greater than 0');
      return;
    }
    
    // Prepare car data - keep id for updates, remove for new cars
    const carData = {
      ...(initial ? { id: model.id } : {}), // Include id only when editing
      name: model.name,
      model: model.model,
      brand: brands.find(b => b.id === categoryId)?.name || model.brand,
      brandId: categoryId,
      categoryId: categoryId, // Use the validated categoryId
      description: model.description || `${model.brand} ${model.model} - ${model.year || new Date().getFullYear()}`,
      price: model.price,
      weeklyRate: model.weeklyRate,
      weeklyRateEnabled: model.weeklyRateEnabled,
      monthlyRate: model.monthlyRate,
      seats: model.seats,
      doors: model.doors,
      luggageCapacity: model.luggageCapacity,
      engineType: model.engineType,
      horsepower: model.horsepower,
      acceleration: model.acceleration,
      topSpeed: model.topSpeed,
      images: model.images || [],
      year: model.year,
      location: model.location,
      mileage: model.mileage,
      fuelType: model.fuelType,
      transmission: model.transmission,
      color: model.color,
      features: model.features || [],
      available: model.available !== undefined ? model.available : true,
      status: model.status || 'available',
      vin: model.vin,
      licensePlate: model.licensePlate,
      branch: model.branch,
      rentalTerms: model.rentalTerms || [],
      cancellationPolicy: model.cancellationPolicy,
      isPopular: model.isPopular || false,
      popularSince: model.isPopular && !model.popularSince ? new Date() : model.popularSince
    };
    
    onSave(carData as Car);
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, index?: number) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch('/api/upload/car-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const imageUrl = result.data.imageUrl;
        if (typeof index === 'number') {
          // Update existing image at index
          setModel(prev => ({
            ...prev,
            images: prev.images.map((img, i) => i === index ? imageUrl : img)
          }));
        } else {
          // Add new image
          setModel(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
        }
      } else {
        alert('Failed to upload image: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
    
    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  }

  function addImage() {
    // Trigger file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => handleImageUpload(e);
    input.click();
  }

  function updateImage(index: number, value: string) {
    setModel(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  }

  function removeImage(index: number) {
    setModel(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }
  
  function replaceImage(index: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => handleImageUpload(e, index);
    input.click();
  }

  function addFeature() {
    setModel(prev => ({ ...prev, features: [...(prev.features || []), ""] }));
  }

  function updateFeature(index: number, value: string) {
    setModel(prev => ({
      ...prev,
      features: (prev.features || []).map((feature, i) => i === index ? value : feature)
    }));
  }

  function removeFeature(index: number) {
    setModel(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  }

  function addRentalTerm() {
    setModel(prev => ({ ...prev, rentalTerms: [...(prev.rentalTerms || []), ""] }));
  }

  function updateRentalTerm(index: number, value: string) {
    setModel(prev => ({
      ...prev,
      rentalTerms: (prev.rentalTerms || []).map((term, i) => i === index ? value : term)
    }));
  }

  function removeRentalTerm(index: number) {
    setModel(prev => ({
      ...prev,
      rentalTerms: (prev.rentalTerms || []).filter((_, i) => i !== index)
    }));
  }

  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-auto border-l bg-secondary-gradient p-4 shadow-lg"
        role="dialog" 
        aria-modal="true" 
        aria-label="Car Editor"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{initial ? "Edit Car" : "New Car"}</h2>
          <button className="rounded border px-3 py-1.5 text-sm" onClick={onClose}>Close</button>
        </div>

        <div className="grid gap-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Basic Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Name *</label>
                <input className="w-full rounded border p-2 text-sm"
                  value={model.name} onChange={(e)=>setModel((m: Car)=>({ ...m, name: e.target.value }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Model *</label>
                <input className="w-full rounded border p-2 text-sm"
                  value={model.model} onChange={(e)=>setModel((m: Car)=>({ ...m, model: e.target.value }))}/>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Brand *</label>
              <select className="w-full rounded border p-2 text-sm"
                value={model.categoryId || model.brandId} onChange={(e)=>setModel((m: Car)=>({ 
                  ...m, 
                  categoryId: e.target.value, 
                  brandId: e.target.value,
                  brand: brands.find(b => b.id === e.target.value)?.name || "" 
                }))}>
                <option value="">Select Brand</option>
                {brands.length > 0 ? brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                )) : (
                  <option disabled>No brands available</option>
                )}
              </select>
              {brands.length === 0 && (
                <div className="text-xs text-red-500 mt-1">No categories found. Please add some categories first.</div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Description</label>
              <textarea className="w-full rounded border p-2 text-sm" rows={3}
                value={model.description} onChange={(e)=>setModel((m: Car)=>({ ...m, description: e.target.value }))}/>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Pricing</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Daily Rate ($) *</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={0} step={1} placeholder="Enter daily rate"
                  value={model.price || ""} onChange={(e)=>setModel((m: Car)=>({ ...m, price: Number(e.target.value) || 0 }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Weekly Rate ($)</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={0} step={1}
                  value={model.weeklyRate ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, weeklyRate: e.target.value ? Number(e.target.value) : undefined }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Monthly Rate ($)</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={0} step={1}
                  value={model.monthlyRate ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, monthlyRate: e.target.value ? Number(e.target.value) : undefined }))}/>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Specifications</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Seats *</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={1} step={1}
                  value={model.seats} onChange={(e)=>setModel((m: Car)=>({ ...m, seats: Number(e.target.value) }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Doors *</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={2} step={1}
                  value={model.doors} onChange={(e)=>setModel((m: Car)=>({ ...m, doors: Number(e.target.value) }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Luggage Capacity (L)</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={0} step={1}
                  value={model.luggageCapacity ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, luggageCapacity: e.target.value ? Number(e.target.value) : undefined }))}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Engine Type</label>
                <input className="w-full rounded border p-2 text-sm" placeholder="e.g., V8, Electric"
                  value={model.engineType ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, engineType: e.target.value }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Horsepower</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={0} step={1}
                  value={model.horsepower ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, horsepower: e.target.value ? Number(e.target.value) : undefined }))}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Acceleration (0-60s)</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={0} step={0.1}
                  value={model.acceleration ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, acceleration: e.target.value ? Number(e.target.value) : undefined }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Top Speed (mph)</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={0} step={1}
                  value={model.topSpeed ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, topSpeed: e.target.value ? Number(e.target.value) : undefined }))}/>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Details</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Year</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={1900} max={2024}
                  value={model.year ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, year: e.target.value ? Number(e.target.value) : undefined }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Fuel Type</label>
                <select className="w-full rounded border p-2 text-sm"
                  value={model.fuelType ?? "gasoline"} onChange={(e)=>setModel((m: Car)=>({ ...m, fuelType: e.target.value as any }))}>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Transmission</label>
                <select className="w-full rounded border p-2 text-sm"
                  value={model.transmission ?? "automatic"} onChange={(e)=>setModel((m: Car)=>({ ...m, transmission: e.target.value as any }))}>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Color</label>
                <input className="w-full rounded border p-2 text-sm"
                  value={model.color ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, color: e.target.value }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Mileage (km)</label>
                <input className="w-full rounded border p-2 text-sm" type="number" min={0} step={1}
                  value={model.mileage ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, mileage: e.target.value ? Number(e.target.value) : undefined }))}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Location</label>
                <input className="w-full rounded border p-2 text-sm"
                  value={model.location ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, location: e.target.value }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Branch</label>
                <select className="w-full rounded border p-2 text-sm"
                  value={model.branch ?? "Doha"} onChange={(e)=>setModel((m: Car)=>({ ...m, branch: e.target.value as any }))}>
                  <option value="Doha">Doha</option>
                  <option value="Al Wakrah">Al Wakrah</option>
                  <option value="Al Khor">Al Khor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Identifiers */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Identifiers</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">VIN</label>
                <input className="w-full rounded border p-2 text-sm"
                  value={model.vin ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, vin: e.target.value }))}/>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">License Plate</label>
                <input className="w-full rounded border p-2 text-sm"
                  value={model.licensePlate ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, licensePlate: e.target.value }))}/>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Status</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Status</label>
                <select className="w-full rounded border p-2 text-sm"
                  value={model.status || "available"} onChange={(e)=>setModel((m: Car)=>({ ...m, status: e.target.value as any }))}>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={model.available}
                    onChange={(e)=>setModel((m: Car)=>({ ...m, available: e.target.checked }))}/>
                  <span className="text-xs font-medium text-zinc-600">Available for rental</span>
                </label>
              </div>
            </div>
          </div>

          {/* Most Popular */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Most Popular</h3>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={model.isPopular || false}
                  onChange={(e)=>setModel((m: Car)=>({ 
                    ...m, 
                    isPopular: e.target.checked,
                    popularSince: e.target.checked && !model.popularSince ? new Date() : model.popularSince
                  }))}
                />
                <span className="text-xs font-medium text-zinc-600">Add this car to Most Popular section</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Images</h3>
            <div className="grid grid-cols-2 gap-2">
              {model.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-video rounded border bg-zinc-50 overflow-hidden">
                    {image && image.trim() ? (
                      <>
                        <img 
                          src={image} 
                          alt={`Car image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            className="rounded bg-white px-2 py-1 text-xs text-zinc-900 hover:bg-zinc-100"
                            onClick={() => replaceImage(index)}
                          >
                            Replace
                          </button>
                          <button 
                            className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                            onClick={() => removeImage(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <input 
                    className="mt-1 w-full rounded border p-1 text-xs" 
                    placeholder="Or paste URL" 
                    value={image || ''} 
                    onChange={(e)=>updateImage(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button 
              className="rounded border px-3 py-1.5 text-xs hover:bg-zinc-50 transition-colors" 
              onClick={addImage}
            >
              + Add Image from Device
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Features</h3>
            {(model.features || []).map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input className="flex-1 rounded border p-2 text-sm" placeholder="Feature name"
                  value={feature} onChange={(e)=>updateFeature(index, e.target.value)}/>
                <button className="rounded border px-2 py-1 text-xs" onClick={()=>removeFeature(index)}>Remove</button>
              </div>
            ))}
            <button className="rounded border px-3 py-1 text-xs" onClick={addFeature}>Add Feature</button>
          </div>

          {/* Rental Terms */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 border-b pb-1">Rental Terms</h3>
            {(model.rentalTerms || []).map((term, index) => (
              <div key={index} className="flex gap-2">
                <input className="flex-1 rounded border p-2 text-sm" placeholder="Rental term"
                  value={term} onChange={(e)=>updateRentalTerm(index, e.target.value)}/>
                <button className="rounded border px-2 py-1 text-xs" onClick={()=>removeRentalTerm(index)}>Remove</button>
              </div>
            ))}
            <button className="rounded border px-3 py-1 text-xs" onClick={addRentalTerm}>Add Term</button>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Cancellation Policy</label>
              <textarea className="w-full rounded border p-2 text-sm" rows={2}
                value={model.cancellationPolicy ?? ""} onChange={(e)=>setModel((m: Car)=>({ ...m, cancellationPolicy: e.target.value }))}/>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t pt-4">
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

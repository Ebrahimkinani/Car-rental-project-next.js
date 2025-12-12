# Car Image Upload Feature

## Overview
Updated the car creation/editing form to support image uploads directly from the device instead of requiring URLs.

## Changes Made

### 1. Created Car Image Upload API
**File:** `src/app/api/upload/car-image/route.ts`
- New API endpoint for uploading car images
- Validates file type (images only)
- Validates file size (5MB max)
- Saves images to `public/images/cars/` directory
- Returns the uploaded image URL

### 2. Updated Car Drawer Form
**File:** `src/app/(admin)/_components/forms/CarDrawer.tsx`

#### New Functions:
- `handleImageUpload()` - Handles file upload from device
- `replaceImage()` - Allows replacing existing images
- Updated `addImage()` - Now triggers file picker instead of URL input

#### UI Improvements:
- Image preview grid showing uploaded images
- Hover overlay with "Replace" and "Remove" buttons
- File upload on click or drag-and-drop (via file picker)
- Ability to still paste URLs manually

### 3. Created Directories
- Created `public/images/cars/` directory for storing car images
- Added README.md documentation

## How to Use

### Adding Car Images:
1. Go to Admin Panel → Units
2. Click "Add Car"
3. Fill in car details
4. Scroll to "Images" section
5. Click "+ Add Image from Device" button
6. Select image from your computer
7. Image will be uploaded and displayed
8. Repeat to add more images
9. To replace an image: hover over it and click "Replace"
10. To remove an image: hover over it and click "Remove"

### Features:
- ✅ Upload images directly from device
- ✅ Image preview with aspect ratio maintained
- ✅ Hover to show replace/remove buttons
- ✅ Multiple image support
- ✅ Still supports URL input for flexibility
- ✅ File validation (image types only, max 5MB)
- ✅ Unique filenames to prevent conflicts

## Technical Details

### File Upload Flow:
1. User clicks "Add Image from Device"
2. File picker opens
3. User selects image
4. File is validated (type and size)
5. FormData created and sent to `/api/upload/car-image`
6. Server saves image to `public/images/cars/`
7. Returns image URL
8. Image URL added to car's images array

### Image Storage:
- Location: `public/images/cars/`
- Filename format: `car-{timestamp}-{random}.{ext}`
- Example: `car-1234567890-abc123.jpg`

### Supported Formats:
- JPEG/JPG
- PNG
- GIF
- WebP
- Other image formats

## Benefits

1. **Better User Experience**: Upload images directly without needing URLs
2. **More Control**: Images stored locally on the server
3. **Visual Feedback**: See image previews before saving
4. **Flexibility**: Still supports URL input for special cases
5. **Easy Management**: Hover to replace or remove images
6. **Validated**: File type and size validation for quality control

## Notes

- Images are saved locally in the project's `public` folder
- Maximum file size is 5MB per image
- Images are accessible via `/images/cars/{filename}`
- The feature maintains backward compatibility with existing URL-based images



# Images Directory

This directory contains all the static images used in the Cars project.

## Directory Structure

- `cars/` - Car images for the main content
- `hero/` - Hero section images and banners
- `icons/` - Icons, logos, and small graphics

## Usage

Images in this directory can be referenced in your components using the public path:

```jsx
import Image from 'next/image'

// For an image at public/images/cars/car1.jpg
<Image src="/images/cars/car1.jpg" alt="Car description" width={800} height={600} />
```

## Supported Formats

- JPG/JPEG
- PNG
- WebP
- SVG
- GIF

## Image Optimization

Next.js automatically optimizes images when using the `next/image` component. Make sure to:

1. Use appropriate dimensions
2. Compress images before adding them
3. Use WebP format when possible for better performance

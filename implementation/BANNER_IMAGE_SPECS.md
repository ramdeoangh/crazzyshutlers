# Banner Image Specifications

## Recommended Banner Image Sizes

### Hero Banner (Home Page)
- **Recommended Size**: 1920 x 1080 pixels (16:9 aspect ratio)
- **Minimum Size**: 1200 x 675 pixels
- **Maximum Size**: 2560 x 1440 pixels
- **File Format**: JPG (for photos) or PNG (for graphics with transparency)
- **File Size**: Optimize to under 500KB for web performance
- **Usage**: Full-width hero section on home page

### Tournament Event Banner
- **Recommended Size**: 1920 x 600 pixels (16:5 aspect ratio)
- **Alternative**: 1920 x 800 pixels (12:5 aspect ratio)
- **File Format**: JPG or PNG
- **File Size**: Optimize to under 400KB
- **Usage**: Featured tournament section

### Page Header Banners
- **Recommended Size**: 1920 x 400 pixels (24:5 aspect ratio)
- **File Format**: JPG or PNG
- **File Size**: Optimize to under 300KB
- **Usage**: Header sections on About, Contact, Tournament pages

### Card/Feature Banners
- **Recommended Size**: 800 x 450 pixels (16:9 aspect ratio)
- **File Format**: JPG or PNG
- **File Size**: Optimize to under 200KB
- **Usage**: Feature cards, event cards

## Logo Specifications

### Logo Files Needed

1. **Logo Dark** (`/public/logo-dark.png`)
   - For use on light backgrounds (white, light gray)
   - Recommended size: 400 x 400 pixels (square)
   - Format: PNG with transparency
   - Will be displayed at various sizes (50px to 200px)

2. **Logo Light** (`/public/logo-light.png`)
   - For use on dark backgrounds (dark blue, black)
   - Recommended size: 400 x 400 pixels (square)
   - Format: PNG with transparency
   - Will be displayed at various sizes (50px to 200px)

### Logo Usage
- **Navbar**: 50px x 50px (mobile), 60px x 60px (desktop)
- **Footer**: 80px x 80px
- **Favicon**: 32px x 32px (create separately)

## Image Optimization Tips

1. **Use Next.js Image Component**: The app uses Next.js Image component for automatic optimization
2. **Compress Images**: Use tools like:
   - [TinyPNG](https://tinypng.com/)
   - [Squoosh](https://squoosh.app/)
   - [ImageOptim](https://imageoptim.com/)
3. **WebP Format**: Consider converting to WebP for better compression (Next.js supports this)
4. **Responsive Images**: Next.js Image component handles responsive images automatically

## File Naming Convention

- `banner-hero.jpg` - Main hero banner
- `banner-tournament.jpg` - Tournament event banner
- `banner-about.jpg` - About page banner
- `logo-dark.png` - Dark logo variant
- `logo-light.png` - Light logo variant
- `og-image.jpg` - Open Graph image (1200 x 630px)

## Where to Place Images

Place all images in the `/public` directory:
```
public/
  ├── logo-dark.png
  ├── logo-light.png
  ├── banner-hero.jpg
  ├── banner-tournament.jpg
  ├── og-image.jpg
  └── favicon.ico
```

## Quick Reference

| Image Type | Dimensions | Aspect Ratio | Max File Size |
|------------|------------|--------------|---------------|
| Hero Banner | 1920 x 1080 | 16:9 | 500KB |
| Tournament Banner | 1920 x 600 | 16:5 | 400KB |
| Page Header | 1920 x 400 | 24:5 | 300KB |
| Feature Card | 800 x 450 | 16:9 | 200KB |
| Logo | 400 x 400 | 1:1 | 100KB |
| OG Image | 1200 x 630 | 1.91:1 | 300KB |

## Notes

- All images should be optimized for web
- Use high-quality source images, then compress for web
- Consider retina displays (2x resolution) for logos
- Test images on different screen sizes
- Ensure text in images is readable at all sizes


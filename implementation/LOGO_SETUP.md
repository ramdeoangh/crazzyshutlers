# Logo Setup Instructions

## Logo Files Required

You need to add two logo files to the `/public` directory:

1. **`/public/logo-dark.png`** - For use on light backgrounds (white, light gray)
   - Used in: Navbar, light sections
   - Recommended: 400 x 400 pixels (square)
   - Format: PNG with transparency

2. **`/public/logo-light.png`** - For use on dark backgrounds (dark blue, black)
   - Used in: Footer, dark sections
   - Recommended: 400 x 400 pixels (square)
   - Format: PNG with transparency

## Logo Specifications

Based on your logo design:
- **Circular logo** with "Crazzy Shuttlers Badminton Federation Pune"
- **CSF initials** in the center (C=Yellow, S=Green, F=Red)
- **Shuttlecock and racket** graphics
- **Golden border** with dark blue background

### Export Settings

1. Export at **400 x 400 pixels** (or higher for retina displays)
2. Use **PNG format** with transparency
3. For **logo-dark.png**: Export with original colors (for light backgrounds)
4. For **logo-light.png**: You may need to adjust colors for visibility on dark backgrounds
   - Consider inverting colors or using a lighter variant
   - Or use the same logo if it works on both backgrounds

## Quick Setup

1. Place your logo files in the `public` folder:
   ```
   public/
     ├── logo-dark.png
     └── logo-light.png
   ```

2. The Logo component will automatically:
   - Display the appropriate variant based on background
   - Fall back to text logo if images are missing
   - Scale appropriately for different screen sizes

## Testing

After adding logos:
1. Check the Navbar (should show logo-dark)
2. Check the Footer (should show logo-light)
3. Verify on mobile devices
4. Test on different screen sizes

## Fallback

If logo files are not found, the component will automatically show:
- 🏸 emoji + "CSF" text in Navbar
- 🏸 emoji + organization name in Footer

This ensures the site works even before logos are added.


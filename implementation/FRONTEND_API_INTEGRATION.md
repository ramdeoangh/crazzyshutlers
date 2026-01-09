# Frontend API Integration Guide

## Overview

The frontend now fetches events and banners dynamically from the API instead of using static configuration.

## What's Changed

### 1. API Service Layer
- Created `src/services/api.ts` with functions to fetch events and banners
- All API calls are centralized and reusable

### 2. Updated Components

#### Home Page (`src/app/page.tsx`)
- Fetches featured event from API
- Fetches hero banner from API
- Passes data to TournamentHero component

#### Tournament Page (`src/app/tournament/page.tsx`)
- Fetches featured event details
- Fetches tournament banner
- Displays dynamic event information

#### TournamentHero Component
- Accepts event and banner props
- Displays dynamic content from API
- Handles external registration URLs

#### TournamentDetails Component
- Accepts event prop
- Parses categories and schedule from JSON
- Displays dynamic tournament information

### 3. Image Optimization
- Created `BannerImage` component using Next.js Image
- Automatic image optimization
- Support for external URLs (cloud storage)
- Responsive images with proper sizing

## How It Works

### Data Flow

```
API (Database) → API Service → Page Component → Feature Component → UI
```

1. **Page Component** (Server Component)
   - Fetches data using API service functions
   - Passes data as props to child components

2. **Feature Components**
   - Receive data as props
   - Render UI with dynamic content

3. **API Service**
   - Handles all API calls
   - Provides type-safe interfaces
   - Handles errors gracefully

### Example: Home Page

```typescript
// Server Component - fetches data
export default async function HomePage() {
  const [featuredEvent, heroBanner] = await Promise.all([
    getFeaturedEvent(),
    getBanner("hero", "home"),
  ]);

  return <TournamentHero event={featuredEvent} banner={heroBanner} />;
}
```

## API Functions

### Events
- `getEvents(params?)` - Get all events
- `getEvent(id)` - Get single event
- `getFeaturedEvent()` - Get featured active event

### Banners
- `getBanners(params?)` - Get all banners
- `getBanner(type, page?)` - Get banner by type and page

## Fallback Behavior

If API fails or returns no data:
- Uses default configuration from `appConfig`
- Shows placeholder content
- Gracefully degrades without errors

## Image Handling

### BannerImage Component
- Uses Next.js Image for optimization
- Supports both local and external URLs
- Automatic format conversion (WebP, AVIF)
- Responsive sizing

### Image Sources
1. **Local**: `/uploads/filename.jpg`
2. **Cloudinary**: `https://res.cloudinary.com/...`
3. **S3**: `https://bucket.s3.region.amazonaws.com/...`

## Configuration

### Next.js Image Domains
Already configured in `next.config.mjs`:
- Cloudinary
- AWS S3
- CloudFront

Add more domains as needed.

## Error Handling

- API failures return `null`
- Components handle `null` gracefully
- Fallback to static content
- No crashes on API errors

## Performance

### Caching
- API calls use `cache: "no-store"` for fresh data
- Consider adding revalidation for production

### Image Optimization
- Next.js Image component handles optimization
- Automatic format conversion
- Lazy loading for non-priority images

## Testing

### Test with No Data
1. Clear database
2. Verify fallback to static content
3. Check for console errors

### Test with Data
1. Create event in admin panel
2. Upload banner image
3. Verify display on frontend

## Future Enhancements

1. **Caching Strategy**
   - Add ISR (Incremental Static Regeneration)
   - Implement SWR for client-side fetching

2. **Real-time Updates**
   - Add WebSocket support
   - Real-time event updates

3. **Error Boundaries**
   - Add React Error Boundaries
   - Better error messages

4. **Loading States**
   - Add skeleton loaders
   - Progressive enhancement

## Troubleshooting

### Images Not Loading
- Check image URLs in database
- Verify domain in next.config.mjs
- Check CORS settings for external images

### Events Not Showing
- Verify event is active and featured
- Check API endpoint
- Verify database has data

### API Errors
- Check server logs
- Verify database connection
- Check API route handlers


# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Application**
   
   Edit `src/config/app.ts` and update:
   - Tournament dates (if different from 7-8 February)
   - Contact email and phone
   - Social media links (replace `#` with actual URLs)
   - Google Form registration URL

3. **Google Form Setup**
   
   To get your Google Form embed URL:
   - Create a Google Form
   - Click "Send" button
   - Click the `</>` (embed) icon
   - Copy the `src` attribute from the iframe
   - Update `registrationFormUrl` in `src/config/app.ts`
   
   Example:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSd.../viewform?embedded=true
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Customization

### Colors & Theme

Edit `tailwind.config.ts` to customize:
- Primary colors (currently blue)
- Accent colors (currently red)
- Font families

### Content

- **Home Page**: Edit `src/app/page.tsx`
- **Tournament Details**: Edit `src/features/tournament/TournamentDetails.tsx`
- **About Content**: Edit `src/app/about/page.tsx`
- **Contact Info**: Edit `src/config/app.ts` (social links)

### SEO

- Default metadata: `src/config/metadata.ts`
- Page-specific metadata: Each page exports its own `metadata` object
- Sitemap: Automatically generated at `/sitemap.xml`
- Robots.txt: `public/robots.txt`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Vercel auto-detects Next.js
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Traditional VPS (using PM2 or similar)

## Next Steps

After initial setup, consider:

1. **Replace Placeholder Assets**
   - Add actual favicon (`public/favicon.ico`)
   - Add Open Graph image (`public/og-image.jpg`)
   - Add apple-touch-icon (`public/apple-touch-icon.png`)

2. **Update Google Form URL**
   - Create your registration form
   - Update the URL in `src/config/app.ts`

3. **Customize Content**
   - Update all text content to match your organization
   - Add real contact information
   - Update social media links

4. **Test Responsiveness**
   - Test on mobile devices
   - Test on tablets
   - Test on desktop

5. **SEO Optimization**
   - Verify metadata in browser dev tools
   - Test Open Graph tags with [Open Graph Debugger](https://www.opengraph.xyz/)
   - Submit sitemap to Google Search Console

## Future Enhancements

The architecture is designed to easily add:

- **Authentication**: Add to `src/features/auth/`
- **Payments**: Add to `src/services/payments/`
- **Admin Dashboard**: Add to `src/app/admin/`
- **Player Profiles**: Add to `src/features/players/`
- **API Routes**: Add to `src/app/api/`
- **Database**: Add models to `src/models/` or use Prisma
- **CMS**: Integrate with headless CMS in `src/services/cms/`

All new features can be added without refactoring existing code thanks to the feature-driven architecture.


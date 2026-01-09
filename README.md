# Crazzy Shuttlers Badminton Platform

A production-grade, scalable Next.js application for badminton tournament and community management.

## 🚀 Tech Stack

- **Next.js 14+** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **ESLint + Prettier**

## 📁 Project Structure

```
src/
 ├── app/                    # Next.js App Router pages
 │   ├── layout.tsx          # Root layout
 │   ├── page.tsx            # Home page
 │   ├── tournament/         # Tournament page
 │   ├── register/           # Registration page
 │   ├── about/              # About page
 │   └── contact/            # Contact page
 ├── components/
 │   ├── layout/             # Layout components (Navbar, Footer)
 │   ├── ui/                 # Reusable UI components (Button, Card)
 │   └── common/             # Common shared components
 ├── features/
 │   └── tournament/         # Tournament feature components
 ├── hooks/                  # Custom React hooks
 ├── services/               # API services and external integrations
 ├── config/                 # App configuration
 ├── styles/                 # Global styles
 └── utils/                  # Utility functions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd csf
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:
   - Update `src/config/app.ts` with your actual configuration
   - Update the Google Form URL in `appConfig.tournament.registrationFormUrl`

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Configuration

### App Configuration

Edit `src/config/app.ts` to customize:
- Organization name and domain
- Tournament dates and details
- Contact information
- Social media links
- Google Form registration URL

### Google Form Integration

To embed your Google Form:

1. Create a Google Form
2. Click "Send" → Select the embed icon `</>`
3. Copy the iframe src URL
4. Update `appConfig.tournament.registrationFormUrl` in `src/config/app.ts`

The URL should look like:
```
https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true
```

## 🏗️ Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and configure the build

### Deploy to Other Platforms

This Next.js app can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting** (using `npm run build` and `npm start`)

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette. The current theme uses:
- Primary colors (blue)
- Accent colors (red)

### Styling

All styling uses Tailwind CSS utility classes. Global styles are in `src/app/globals.css`.

## 📱 Features

### Current Features (Phase 1)

- ✅ Responsive home page with hero section
- ✅ Tournament details page
- ✅ Registration page with Google Form embed
- ✅ About page
- ✅ Contact page
- ✅ SEO-optimized with metadata and Open Graph tags
- ✅ Mobile-first responsive design
- ✅ Accessible UI components

### Future Features (Designed for, not implemented)

- Multiple tournaments management
- Player profiles and rankings
- Admin dashboard
- Payment integration
- User authentication
- CMS integration
- Analytics dashboard
- Sponsorship management
- PWA support
- Mobile apps

## 🔧 Development

### Code Quality

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`
- **Type Checking**: Built into Next.js build process

### Project Architecture

The project follows a feature-driven architecture designed for scalability:

- **Features**: Domain-specific feature modules
- **Components**: Reusable UI and layout components
- **Services**: API integrations and business logic
- **Config**: Centralized configuration
- **Utils**: Shared utility functions

This structure allows easy addition of new features without refactoring existing code.

## 📄 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

---

Built with ❤️ for the badminton community


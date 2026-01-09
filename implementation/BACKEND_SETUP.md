# Backend Setup Guide

## Overview

The backend includes:
- **Prisma ORM** with MySQL database
- **RESTful API** for events, banners, users, settings, and logs management
- **JWT Authentication** for admin and user access
- **Swagger/OpenAPI** documentation
- **Admin Panel** for managing content
- **User Management** with registration and login
- **Application Logging** system

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://username:password@localhost:3306/crazzyshuttlers"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database and run migrations
npm run db:push

# Seed database with default admin and sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

## Default Admin Credentials

After seeding:
- **Email**: `admin@crazzyshuttlers.com`
- **Password**: `admin123`

**⚠️ Change these credentials immediately in production!**

## Database Management

### Prisma Studio (Visual Database Editor)

```bash
npm run db:studio
```

Opens a web interface at `http://localhost:5555` to view and edit database records.

### Database Migrations

```bash
# Create a new migration
npm run db:migrate

# Apply migrations
npm run db:push
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Events

- `GET /api/events` - Get all events (public)
  - Query params: `?featured=true&active=true`
- `GET /api/events/[id]` - Get single event (public)
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/[id]` - Update event (admin only)
- `DELETE /api/events/[id]` - Delete event (admin only)

### Banners

- `GET /api/banners` - Get all banners (public)
  - Query params: `?type=hero&page=home&active=true`
- `GET /api/banners/[id]` - Get single banner (public)
- `POST /api/banners` - Create banner (admin only)
- `PUT /api/banners/[id]` - Update banner (admin only)
- `DELETE /api/banners/[id]` - Delete banner (admin only)

### Upload

- `POST /api/upload` - Upload image file (admin only)
  - Form data: `file` (multipart/form-data)

## API Documentation (Swagger)

Access interactive API documentation at:
- **URL**: `http://localhost:3000/api-docs`

The Swagger UI allows you to:
- View all API endpoints
- See request/response schemas
- Test API calls directly from the browser
- Authorize with JWT token for protected endpoints

## Admin Panel

### Access

1. Navigate to `/admin/login`
2. Login with admin credentials
3. Access dashboard at `/admin/dashboard`

### Features

- **Dashboard**: Overview of events and banners
- **Events Management**: Create, edit, delete events
- **Banners Management**: Upload, edit, delete banner images
- **API Documentation**: Link to Swagger UI

## Authentication Flow

1. Admin logs in via `/api/auth/login`
2. Server returns JWT token
3. Token stored in:
   - HTTP-only cookie (server-side)
   - localStorage (client-side, for API calls)
4. Protected routes check token via `Authorization: Bearer <token>` header

## Image Upload

### Current Implementation

- Images uploaded to `/public/uploads/` directory
- Returns public URL: `/uploads/filename.jpg`

### Production Recommendations

For production, use cloud storage:
- **AWS S3**
- **Cloudinary**
- **Vercel Blob Storage**
- **Google Cloud Storage**

Update `/api/upload/route.ts` to use your preferred service.

## Database Schema

### Admin
- `id` (String, CUID)
- `email` (String, unique)
- `password` (String, hashed)
- `name` (String)
- `createdAt`, `updatedAt`

### Event
- `id` (String, CUID)
- `title` (String)
- `description` (String, optional)
- `startDate` (DateTime)
- `endDate` (DateTime)
- `registrationUrl` (String, optional)
- `isActive` (Boolean)
- `isFeatured` (Boolean)
- `categories` (String, JSON)
- `matchFormat` (String, optional)
- `schedule` (String, JSON)
- `createdAt`, `updatedAt`

### Banner
- `id` (String, CUID)
- `title` (String)
- `description` (String, optional)
- `imageUrl` (String)
- `imageAlt` (String, optional)
- `type` (String: hero, tournament, page-header, feature-card)
- `page` (String, optional)
- `isActive` (Boolean)
- `order` (Int)
- `createdAt`, `updatedAt`

## Security Considerations

1. **JWT Secret**: Use a strong, random secret in production
2. **Password Hashing**: Uses bcrypt with salt rounds of 10
3. **HTTP-only Cookies**: Prevents XSS attacks
4. **Input Validation**: Uses Zod schemas for validation
5. **SQL Injection**: Prisma ORM prevents SQL injection
6. **File Upload**: Validate file types and sizes in production

## Production Deployment

### Environment Variables

Set these in your hosting platform:

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-random-secret"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Database

For production, consider:
- **PostgreSQL** (recommended)
- **MySQL**
- **SQLite** (for small deployments)

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

### Build

```bash
npm run build
npm start
```

## Troubleshooting

### Database Issues

```bash
# Reset database (WARNING: Deletes all data)
# For MySQL, drop and recreate the database:
mysql -u root -p
DROP DATABASE crazzyshuttlers;
CREATE DATABASE crazzyshuttlers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Then push schema and seed
npm run db:push
npm run db:seed
```

### Authentication Issues

- Clear cookies and localStorage
- Check JWT_SECRET matches
- Verify admin exists in database

### API Errors

- Check server logs
- Verify database connection
- Ensure Prisma Client is generated: `npm run db:generate`

## Next Steps

1. Update frontend to fetch events/banners from API
2. Add image optimization (Next.js Image component)
3. Implement cloud storage for images
4. Add more admin features (user management, analytics)
5. Add rate limiting for API endpoints
6. Implement email notifications


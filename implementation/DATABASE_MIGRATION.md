# Database Migration Guide - SQLite to MySQL

## Overview

The application has been updated to use MySQL instead of SQLite. This guide will help you migrate your database.

## New Schema Features

### 1. User Management
- **User table**: Complete user profiles with password authentication
- **Role table**: Role-based access control (admin, member, etc.)
- **Login table**: Robust login tracking with session management

### 2. Membership & Payments
- **Membership table**: Track membership status and fees
- **Payment table**: Payment records with gateway integration support

### 3. Events & Tournaments
- **Event table**: Enhanced with more fields
- **Tournament table**: Separate tournaments within events
- **EventRegistration table**: User event registrations
- **TournamentRegistration table**: Tournament-specific registrations

### 4. Image Gallery
- **ImageGallery table**: Centralized image management
- Can be linked to events or used standalone

### 5. Settings
- **Setting table**: All website settings in database
- Categories: general, email, payment, popup, newsletter
- Public/private settings support

### 6. Application Logs
- **AppLog table**: Comprehensive activity logging
- JSON format for flexible data storage
- Tracks all user actions and system events

## Migration Steps

### 1. Set Up MySQL Database

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE crazzyshuttlers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Update Environment Variables

Update `.env` file:

```env
# Change from SQLite to MySQL
DATABASE_URL="mysql://username:password@localhost:3306/crazzyshuttlers"

# Other required variables
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Install MySQL Client (if needed)

```bash
npm install mysql2
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Push Schema to Database

```bash
npm run db:push
```

This will create all tables in MySQL.

### 6. Seed Database

```bash
npm run db:seed
```

This will create:
- Default roles (admin, member)
- Admin user (admin@crazzyshuttlers.com / admin123)
- Default settings
- Sample event

## New Tables Structure

### Users & Authentication
```
users
├── id, email, password (hashed)
├── firstName, lastName, fullName
├── phone, address, city, state, pincode
├── profileImage, dateOfBirth, gender
├── isActive, isEmailVerified, isPhoneVerified
└── roleId → roles

roles
├── id, name, description
└── permissions (JSON)

logins
├── id, userId, email
├── loginMethod, ipAddress, userAgent
├── isSuccessful, failureReason
├── sessionToken, expiresAt, loggedOutAt
└── deviceInfo (JSON)
```

### Membership & Payments
```
memberships
├── id, userId, membershipType
├── amount, status
├── paymentId → payments
└── paidAt, expiresAt

payments
├── id, userId, amount, currency
├── paymentMethod, paymentGateway
├── status, description
└── metadata (JSON)
```

### Events & Tournaments
```
events
├── id, title, description
├── startDate, endDate
├── registrationStart, registrationEnd
├── venue, address, city, state
├── isActive, isFeatured, isPublic
├── categories, matchFormat (JSON)
├── schedule, rules, prizes (JSON)
├── maxParticipants, currentParticipants
├── registrationFee
└── bannerImageId → image_gallery

tournaments
├── id, eventId → events
├── name, description, category
├── format, startDate, endDate
├── status, maxParticipants
├── registrationFee
└── rules, bracket, results (JSON)

event_registrations
├── id, eventId, userId
├── status, paymentId
└── metadata (JSON)

tournament_registrations
├── id, tournamentId, userId
├── partnerId (for doubles)
├── status, paymentId
└── metadata (JSON)
```

### Image Gallery
```
image_gallery
├── id, title, description
├── imageUrl, imageAlt
├── type, category
├── eventId → events (optional)
├── isActive, order
└── metadata (JSON)
```

### Settings
```
settings
├── id, key (unique)
├── category, value, valueType
├── description, isPublic
└── metadata (JSON)
```

### Application Logs
```
app_logs
├── id, userId → users (optional)
├── action, entityType, entityId
├── level, message
├── data (JSON)
├── ipAddress, userAgent, requestId
└── createdAt
```

## Key Features

### 1. User Registration
- Email/password registration
- Optional membership fee payment (100 INR)
- Auto-login after registration
- Role assignment (member by default)

### 2. Robust Login System
- Tracks all login attempts
- Stores IP, user agent, device info
- Session token management
- Login history in database

### 3. Settings Management
- All settings in database
- Categorized settings
- Public/private settings
- JSON support for complex values

### 4. Application Logging
- All activities logged
- JSON format for flexibility
- User action tracking
- System event logging
- Filterable by level, action, user, etc.

### 5. Role-Based Access
- Roles with permissions
- User role assignment
- Flexible permission system

## API Endpoints

### User Management
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user (to be created)
- `PUT /api/users/profile` - Update profile (to be created)

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings?public=true` - Get public settings
- `GET /api/settings?category=email` - Get by category
- `GET /api/settings/[key]` - Get single setting
- `POST /api/settings` - Create/update setting (admin)
- `DELETE /api/settings/[key]` - Delete setting (admin)

### Logs
- `GET /api/logs` - Get application logs (admin)
- `GET /api/logs?level=error` - Filter by level
- `GET /api/logs?action=login` - Filter by action
- `GET /api/logs?userId=xxx` - Filter by user

## Default Credentials

After seeding:
- **Admin Email**: `admin@crazzyshuttlers.com`
- **Admin Password**: `admin123`
- **Role**: Admin (full access)

⚠️ **Change these in production!**

## Troubleshooting

### Connection Issues
```bash
# Test MySQL connection
mysql -u username -p -h localhost -P 3306 crazzyshuttlers
```

### Migration Errors
```bash
# Reset database (WARNING: Deletes all data)
npm run db:push -- --force-reset

# Or manually drop and recreate
mysql -u root -p
DROP DATABASE crazzyshuttlers;
CREATE DATABASE crazzyshuttlers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Prisma Issues
```bash
# Regenerate client
npm run db:generate

# Check schema
npx prisma validate
```

## Next Steps

1. Update frontend to use new user registration/login
2. Create user profile pages
3. Add payment gateway integration
4. Build log viewer in admin panel
5. Add settings management UI


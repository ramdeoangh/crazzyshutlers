-- ============================================
-- Crazzy Shuttlers Badminton Federation Database
-- Complete Database Schema SQL
-- MySQL 8.0+
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- ============================================
-- AUTHENTICATION & USERS
-- ============================================

-- Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `permissions` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `password` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `firstName` VARCHAR(191) NOT NULL,
  `lastName` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(191) NOT NULL,
  `dateOfBirth` DATETIME(3) NULL,
  `gender` VARCHAR(191) NULL,
  `address` TEXT NULL,
  `city` VARCHAR(191) NULL,
  `state` VARCHAR(191) NULL,
  `pincode` VARCHAR(191) NULL,
  `profileImage` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
  `isPhoneVerified` BOOLEAN NOT NULL DEFAULT false,
  `emailVerifiedAt` DATETIME(3) NULL,
  `phoneVerifiedAt` DATETIME(3) NULL,
  `lastLoginAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `roleId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  KEY `users_roleId_idx` (`roleId`),
  CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Logins Table
CREATE TABLE IF NOT EXISTS `logins` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `loginMethod` VARCHAR(191) NOT NULL DEFAULT 'email',
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` TEXT NULL,
  `deviceInfo` JSON NULL,
  `isSuccessful` BOOLEAN NOT NULL DEFAULT true,
  `failureReason` TEXT NULL,
  `sessionToken` VARCHAR(500) NULL,
  `expiresAt` DATETIME(3) NULL,
  `loggedOutAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `logins_userId_idx` (`userId`),
  KEY `logins_email_idx` (`email`),
  KEY `logins_sessionToken_idx` (`sessionToken`),
  CONSTRAINT `logins_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MEMBERSHIP & PAYMENTS
-- ============================================

-- Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
  `paymentMethod` VARCHAR(191) NULL,
  `paymentGateway` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `description` TEXT NULL,
  `metadata` JSON NULL,
  `paidAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `payments_userId_idx` (`userId`),
  KEY `payments_status_idx` (`status`),
  KEY `payments_paymentGateway_idx` (`paymentGateway`),
  CONSTRAINT `payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Memberships Table
CREATE TABLE IF NOT EXISTS `memberships` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `membershipType` VARCHAR(191) NOT NULL DEFAULT 'standard',
  `amount` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `paymentId` VARCHAR(191) NULL,
  `paidAt` DATETIME(3) NULL,
  `expiresAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `memberships_userId_idx` (`userId`),
  KEY `memberships_status_idx` (`status`),
  CONSTRAINT `memberships_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `memberships_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- EVENTS & TOURNAMENTS
-- ============================================

-- Image Gallery Table (created before events due to circular dependency)
CREATE TABLE IF NOT EXISTS `image_gallery` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `imageUrl` VARCHAR(191) NOT NULL,
  `imageAlt` VARCHAR(191) NULL,
  `type` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NULL,
  `eventId` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `order` INT NOT NULL DEFAULT 0,
  `metadata` JSON NULL,
  `uploadedBy` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `image_gallery_type_idx` (`type`),
  KEY `image_gallery_eventId_idx` (`eventId`),
  KEY `image_gallery_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events Table
CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NOT NULL,
  `registrationStart` DATETIME(3) NULL,
  `registrationEnd` DATETIME(3) NULL,
  `registrationUrl` VARCHAR(191) NULL,
  `venue` VARCHAR(191) NULL,
  `address` VARCHAR(191) NULL,
  `city` VARCHAR(191) NULL,
  `state` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `isFeatured` BOOLEAN NOT NULL DEFAULT false,
  `isPublic` BOOLEAN NOT NULL DEFAULT true,
  `categories` JSON NULL,
  `matchFormat` VARCHAR(191) NULL,
  `schedule` JSON NULL,
  `rules` JSON NULL,
  `prizes` JSON NULL,
  `maxParticipants` INT NULL,
  `currentParticipants` INT NOT NULL DEFAULT 0,
  `registrationFee` DECIMAL(10, 2) NULL,
  `bannerImageId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `events_bannerImageId_key` (`bannerImageId`),
  KEY `events_startDate_idx` (`startDate`),
  KEY `events_isActive_isFeatured_idx` (`isActive`, `isFeatured`),
  CONSTRAINT `events_bannerImageId_fkey` FOREIGN KEY (`bannerImageId`) REFERENCES `image_gallery` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tournaments Table
CREATE TABLE IF NOT EXISTS `tournaments` (
  `id` VARCHAR(191) NOT NULL,
  `eventId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(191) NOT NULL,
  `format` VARCHAR(191) NULL,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'upcoming',
  `maxParticipants` INT NULL,
  `currentParticipants` INT NOT NULL DEFAULT 0,
  `registrationFee` DECIMAL(10, 2) NULL,
  `rules` JSON NULL,
  `bracket` JSON NULL,
  `results` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `tournaments_eventId_idx` (`eventId`),
  KEY `tournaments_status_idx` (`status`),
  CONSTRAINT `tournaments_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event Registrations Table
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` VARCHAR(191) NOT NULL,
  `eventId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `paymentId` VARCHAR(191) NULL,
  `metadata` JSON NULL,
  `registeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `confirmedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_registrations_eventId_userId_key` (`eventId`, `userId`),
  KEY `event_registrations_eventId_idx` (`eventId`),
  KEY `event_registrations_userId_idx` (`userId`),
  KEY `event_registrations_status_idx` (`status`),
  CONSTRAINT `event_registrations_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_registrations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_registrations_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tournament Registrations Table
CREATE TABLE IF NOT EXISTS `tournament_registrations` (
  `id` VARCHAR(191) NOT NULL,
  `tournamentId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `partnerId` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `paymentId` VARCHAR(191) NULL,
  `metadata` JSON NULL,
  `registeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `confirmedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tournament_registrations_tournamentId_userId_key` (`tournamentId`, `userId`),
  KEY `tournament_registrations_tournamentId_idx` (`tournamentId`),
  KEY `tournament_registrations_userId_idx` (`userId`),
  CONSTRAINT `tournament_registrations_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tournament_registrations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tournament_registrations_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraint for image_gallery.eventId (after events table is created)
ALTER TABLE `image_gallery` 
  ADD CONSTRAINT `image_gallery_eventId_fkey` 
  FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- SETTINGS
-- ============================================

-- Settings Table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL DEFAULT 'general',
  `value` TEXT NULL,
  `valueType` VARCHAR(191) NOT NULL DEFAULT 'string',
  `description` TEXT NULL,
  `isPublic` BOOLEAN NOT NULL DEFAULT false,
  `metadata` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_key` (`key`),
  KEY `settings_category_idx` (`category`),
  KEY `settings_key_idx` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- APPLICATION LOGS
-- ============================================

-- App Logs Table
CREATE TABLE IF NOT EXISTS `app_logs` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `action` VARCHAR(191) NOT NULL,
  `entityType` VARCHAR(191) NULL,
  `entityId` VARCHAR(191) NULL,
  `level` VARCHAR(191) NOT NULL DEFAULT 'info',
  `message` TEXT NOT NULL,
  `data` JSON NULL,
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` TEXT NULL,
  `requestId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `app_logs_userId_idx` (`userId`),
  KEY `app_logs_action_idx` (`action`),
  KEY `app_logs_entityType_entityId_idx` (`entityType`, `entityId`),
  KEY `app_logs_level_idx` (`level`),
  KEY `app_logs_createdAt_idx` (`createdAt`),
  CONSTRAINT `app_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADMIN (Backward Compatibility)
-- ============================================

-- Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `roleId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BANNERS (Backward Compatibility)
-- ============================================

-- Banners Table
CREATE TABLE IF NOT EXISTS `banners` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `imageUrl` VARCHAR(191) NOT NULL,
  `imageAlt` VARCHAR(191) NULL,
  `type` VARCHAR(191) NOT NULL,
  `page` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `order` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COMMIT TRANSACTION
-- ============================================

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- ============================================
-- TABLE DESCRIPTIONS
-- ============================================

-- roles: User roles (admin, member, user)
-- users: User accounts with authentication
-- logins: Login history and session tracking
-- payments: Payment transactions
-- memberships: User membership records
-- image_gallery: Image storage for events, banners, etc.
-- events: Badminton events and tournaments
-- tournaments: Tournament categories within events
-- event_registrations: User registrations for events
-- tournament_registrations: User registrations for tournaments
-- settings: Application settings and configuration
-- app_logs: Application activity and error logs
-- admins: Admin user accounts (legacy)
-- banners: Banner images (legacy)

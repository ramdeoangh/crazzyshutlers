-- Payments Table SQL
-- Based on Prisma schema for MySQL database

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
  INDEX `payments_userId_idx` (`userId`),
  INDEX `payments_status_idx` (`status`),
  INDEX `payments_paymentGateway_idx` (`paymentGateway`),
  
  CONSTRAINT `payments_userId_fkey` 
    FOREIGN KEY (`userId`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment Status Values:
-- - 'pending': Payment initiated but not completed
-- - 'success': Payment completed successfully
-- - 'failed': Payment failed
-- - 'refunded': Payment was refunded

-- Payment Method Values (examples):
-- - 'razorpay': Razorpay payment gateway
-- - 'stripe': Stripe payment gateway
-- - 'cash': Cash payment
-- - 'bank_transfer': Bank transfer
-- - 'upi': UPI payment
-- - 'card': Card payment

import { prisma } from "./prisma";

export type LogLevel = "debug" | "info" | "warn" | "error" | "critical";

export interface LogData {
  [key: string]: any;
}

export interface CreateLogParams {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  level?: LogLevel;
  message: string;
  data?: LogData;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

/**
 * Application logger
 * Logs all activities to the database in JSON format
 */
export class AppLogger {
  /**
   * Create a log entry
   */
  static async log(params: CreateLogParams): Promise<void> {
    try {
      await prisma.appLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          level: params.level || "info",
          message: params.message,
          data: params.data || {},
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          requestId: params.requestId,
        },
      });
    } catch (error) {
      // Don't throw - logging should never break the app
      console.error("Failed to write log:", error);
    }
  }

  /**
   * Log user action
   */
  static async logUserAction(
    userId: string,
    action: string,
    message: string,
    data?: LogData,
    options?: { ipAddress?: string; userAgent?: string; requestId?: string }
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entityType: "user",
      entityId: userId,
      message,
      data,
      ...options,
    });
  }

  /**
   * Log system event
   */
  static async logSystem(
    action: string,
    message: string,
    level: LogLevel = "info",
    data?: LogData
  ): Promise<void> {
    await this.log({
      action,
      message,
      level,
      data,
    });
  }

  /**
   * Log error
   */
  static async logError(
    action: string,
    message: string,
    error: Error | any,
    userId?: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      level: "error",
      message,
      data: {
        error: error?.message,
        stack: error?.stack,
        ...(typeof error === "object" ? error : {}),
      },
    });
  }

  /**
   * Log login attempt
   */
  static async logLogin(
    userId: string | null,
    email: string,
    success: boolean,
    reason?: string,
    options?: { ipAddress?: string; userAgent?: string }
  ): Promise<void> {
    await this.log({
      userId: userId || undefined,
      action: "login",
      entityType: "user",
      entityId: userId || undefined,
      level: success ? "info" : "warn",
      message: success
        ? `User logged in: ${email}`
        : `Login failed: ${email} - ${reason || "Invalid credentials"}`,
      data: {
        email,
        success,
        reason: reason || null,
      },
      ...options,
    });
  }

  /**
   * Log registration
   */
  static async logRegistration(
    userId: string,
    email: string,
    options?: { ipAddress?: string; userAgent?: string }
  ): Promise<void> {
    await this.log({
      userId,
      action: "register",
      entityType: "user",
      entityId: userId,
      level: "info",
      message: `User registered: ${email}`,
      data: { email },
      ...options,
    });
  }

  /**
   * Log payment
   */
  static async logPayment(
    userId: string,
    paymentId: string,
    amount: number,
    status: string,
    data?: LogData
  ): Promise<void> {
    await this.log({
      userId,
      action: "payment",
      entityType: "payment",
      entityId: paymentId,
      level: status === "success" ? "info" : "warn",
      message: `Payment ${status}: ${amount} INR`,
      data: {
        paymentId,
        amount,
        status,
        ...data,
      },
    });
  }
}


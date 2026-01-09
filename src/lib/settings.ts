import { prisma } from "./prisma";

export interface SettingValue {
  key: string;
  value: any;
  category: string;
  valueType: string;
}

/**
 * Settings management
 * All website settings stored in database
 */
export class SettingsManager {
  /**
   * Get a setting value
   */
  static async get(key: string): Promise<any> {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      return null;
    }

    return this.parseValue(setting.value, setting.valueType);
  }

  /**
   * Get multiple settings by category
   */
  static async getByCategory(category: string): Promise<Record<string, any>> {
    const settings = await prisma.setting.findMany({
      where: { category },
    });

    const result: Record<string, any> = {};
    for (const setting of settings) {
      result[setting.key] = this.parseValue(setting.value, setting.valueType);
    }

    return result;
  }

  /**
   * Get all public settings
   */
  static async getPublic(): Promise<Record<string, any>> {
    const settings = await prisma.setting.findMany({
      where: { isPublic: true },
    });

    const result: Record<string, any> = {};
    for (const setting of settings) {
      result[setting.key] = this.parseValue(setting.value, setting.valueType);
    }

    return result;
  }

  /**
   * Set a setting value
   */
  static async set(
    key: string,
    value: any,
    options?: {
      category?: string;
      description?: string;
      isPublic?: boolean;
      valueType?: string;
    }
  ): Promise<void> {
    const valueType = options?.valueType || this.detectValueType(value);
    const stringValue = this.stringifyValue(value, valueType);

    await prisma.setting.upsert({
      where: { key },
      update: {
        value: stringValue,
        valueType,
        category: options?.category || "general",
        description: options?.description,
        isPublic: options?.isPublic || false,
      },
      create: {
        key,
        value: stringValue,
        valueType,
        category: options?.category || "general",
        description: options?.description,
        isPublic: options?.isPublic || false,
      },
    });
  }

  /**
   * Delete a setting
   */
  static async delete(key: string): Promise<void> {
    await prisma.setting.delete({
      where: { key },
    });
  }

  /**
   * Get membership fee
   */
  static async getMembershipFee(): Promise<number> {
    const fee = await this.get("membership_fee");
    return fee ? Number(fee) : 100; // Default 100 INR
  }

  /**
   * Parse value based on type
   */
  private static parseValue(value: string | null, valueType: string): any {
    if (!value) return null;

    switch (valueType) {
      case "number":
        return Number(value);
      case "boolean":
        return value === "true";
      case "json":
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      default:
        return value;
    }
  }

  /**
   * Stringify value based on type
   */
  private static stringifyValue(value: any, valueType: string): string {
    switch (valueType) {
      case "json":
        return JSON.stringify(value);
      case "boolean":
        return String(value);
      case "number":
        return String(value);
      default:
        return String(value);
    }
  }

  /**
   * Detect value type
   */
  private static detectValueType(value: any): string {
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "object") return "json";
    return "string";
  }
}


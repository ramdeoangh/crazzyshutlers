import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ admin: AdminPayload; token: string } | null> {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return null;
  }

  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) {
    return null;
  }

  const payload: AdminPayload = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  };

  const token = generateToken(payload);

  return { admin: payload, token };
}


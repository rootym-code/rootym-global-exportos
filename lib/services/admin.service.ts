import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

import type { AdminLoginInput } from "@/lib/validations/admin-login";
import { AdminRole } from "@/lib/generated/prisma";

export interface AuthenticatedAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export async function authenticateAdmin(
  credentials: AdminLoginInput
): Promise<AuthenticatedAdmin> {
  const admin = await prisma.admin.findUnique({
    where: {
      email: credentials.email.toLowerCase().trim(),
    },
  });

  if (!admin) {
    throw new Error("Invalid email or password.");
  }

  if (!admin.isActive) {
    throw new Error("Your account has been deactivated. Please contact the administrator.");
  }

  const passwordMatches = await bcrypt.compare(
    credentials.password,
    admin.password
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password.");
  }

  await prisma.admin.update({
    where: {
      id: admin.id,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
}
/**
 * ============================================================
 * ROOTYM Customer Registration API
 * ============================================================
 * Purpose:
 * Creates a ROOTYM customer account using email/password.
 *
 * Responsibilities:
 * - Validate registration input.
 * - Check for an existing customer.
 * - Hash the password securely.
 * - Create User.
 * - Create Tenant.
 * - Create OWNER Membership.
 *
 * This API intentionally does NOT:
 * - authenticate the customer after registration
 * - issue customer JWTs
 * - modify Google OAuth
 * - create subscriptions
 * - start trials
 * - create websites
 *
 * Those concerns remain separate from customer registration.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { createCustomerPasswordHash } from "@/lib/auth/customer-password";
import { prisma } from "@/lib/prisma";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createTenantSlug(email: string): string {
  const localPart = email.split("@")[0] ?? "customer";

  const baseSlug = localPart
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return baseSlug || "customer";
}

async function createUniqueTenantSlug(
  baseSlug: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.tenant.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string"
        ? normalizeEmail(body.email)
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    const name =
      typeof body?.name === "string"
        ? body.name.trim()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A customer account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash =
      await createCustomerPasswordHash(password);

    const baseSlug = createTenantSlug(email);

    const result = await prisma.$transaction(async (tx) => {
      let tenantSlug = baseSlug;
      let counter = 1;

      while (
        await tx.tenant.findUnique({
          where: {
            slug: tenantSlug,
          },
          select: {
            id: true,
          },
        })
      ) {
        counter += 1;
        tenantSlug = `${baseSlug}-${counter}`;
      }

      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          createdAt: true,
        },
      });

      const tenant = await tx.tenant.create({
        data: {
          name: `${name}'s Workspace`,
          slug: tenantSlug,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
        },
      });

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          role: "OWNER",
        },
        select: {
          id: true,
          role: true,
        },
      });

      return {
        user,
        tenant,
        membership,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Customer account created successfully.",
        customer: result.user,
        workspace: result.tenant,
        membership: result.membership,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Customer registration failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create the customer account.",
      },
      { status: 500 }
    );
  }
}
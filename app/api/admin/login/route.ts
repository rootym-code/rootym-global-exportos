import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  createAdminToken,
} from "@/lib/auth";

import { authenticateAdmin } from "@/lib/services/admin.service";
import { adminLoginSchema } from "@/lib/validations/admin-login";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = adminLoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(validation.data);

    const token = await createAdminToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        admin,
      },
      { status: 200 }
    );

    response.cookies.set(
      AUTH_COOKIE_NAME,
      token,
      AUTH_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error.";

    const status =
      message === "Invalid email or password."
        ? 401
        : message ===
          "Your account has been deactivated. Please contact the administrator."
        ? 403
        : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }
}
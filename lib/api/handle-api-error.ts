import { ZodError } from "zod";

import ApiResponse from "./api-response";
import { AppError, isAppError } from "@/lib/errors/app-error";

/**
 * ============================================================
 * Centralized API Error Handler
 * ============================================================
 */
export function handleApiError(error: unknown) {
  console.error(error);

  /**
   * Custom Application Errors
   */
  if (isAppError(error)) {
    return ApiResponse.error({
      message: error.message,
      code: error.code,
      details: error.details,
      status: error.statusCode,
    });
  }

  /**
   * Zod Validation Errors
   */
  if (error instanceof ZodError) {
    return ApiResponse.error({
      message: "Validation failed.",
      code: "VALIDATION_ERROR",
      status: 422,
      details: error.flatten(),
    });
  }

  /**
   * Prisma Errors
   */
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const prismaError = error as {
      code: string;
      message: string;
      meta?: unknown;
    };

    switch (prismaError.code) {
      case "P2002":
        return ApiResponse.error({
          message: "A unique constraint was violated.",
          code: "DUPLICATE",
          status: 409,
          details: prismaError.meta,
        });

      case "P2025":
        return ApiResponse.error({
          message: "Requested resource was not found.",
          code: "NOT_FOUND",
          status: 404,
        });
    }
  }

  /**
   * Unknown Errors
   */
  return ApiResponse.error({
    message: "Internal Server Error.",
    code: "INTERNAL_SERVER_ERROR",
    status: 500,
  });
}

export default handleApiError;
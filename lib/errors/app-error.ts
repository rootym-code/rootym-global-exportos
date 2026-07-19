/**
 * ============================================================
 * ROOTYM Application Error
 * ============================================================
 */

export type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DUPLICATE"
  | "INTERNAL_SERVER_ERROR";

export interface AppErrorOptions {
  code: ErrorCode;
  statusCode: number;
  details?: unknown;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, options: AppErrorOptions) {
    super(message);

    this.name = "AppError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, {
      code: "BAD_REQUEST",
      statusCode: 400,
      details,
    });
  }

  static validation(message: string, details?: unknown) {
    return new AppError(message, {
      code: "VALIDATION_ERROR",
      statusCode: 422,
      details,
    });
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, {
      code: "UNAUTHORIZED",
      statusCode: 401,
    });
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, {
      code: "FORBIDDEN",
      statusCode: 403,
    });
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, {
      code: "NOT_FOUND",
      statusCode: 404,
    });
  }

  static conflict(message: string, details?: unknown) {
    return new AppError(message, {
      code: "CONFLICT",
      statusCode: 409,
      details,
    });
  }

  static duplicate(message: string, details?: unknown) {
    return new AppError(message, {
      code: "DUPLICATE",
      statusCode: 409,
      details,
    });
  }

  static internal(
    message = "Internal Server Error",
    details?: unknown
  ) {
    return new AppError(message, {
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      details,
    });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
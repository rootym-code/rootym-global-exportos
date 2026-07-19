import { NextResponse } from "next/server";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessOptions<T = unknown> {
  message?: string;
  data?: T;
  status?: number;
}

export interface ApiPaginatedOptions<T = unknown> {
  message?: string;
  data: T;
  pagination: PaginationMeta;
  status?: number;
}

export interface ApiErrorOptions {
  message: string;
  code?: string;
  details?: unknown;
  status?: number;
}

export class ApiResponse {
  static success<T>({
    data,
    message = "Success",
    status = 200,
  }: ApiSuccessOptions<T>) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static created<T>({
    data,
    message = "Created successfully",
  }: ApiSuccessOptions<T>) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      {
        status: 201,
      }
    );
  }

  static paginated<T>({
    data,
    pagination,
    message = "Success",
    status = 200,
  }: ApiPaginatedOptions<T>) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
        pagination,
      },
      {
        status,
      }
    );
  }

  static error({
    message,
    code = "INTERNAL_SERVER_ERROR",
    details,
    status = 500,
  }: ApiErrorOptions) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          details,
        },
      },
      {
        status,
      }
    );
  }

  static noContent() {
    return new NextResponse(null, {
      status: 204,
    });
  }
}

export default ApiResponse;
import { AppError } from "@/lib/errors/app-error";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BaseCmsService {
  protected getPagination(options?: PaginationOptions) {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.max(1, Math.min(options?.limit ?? 20, 100));

    return {
      page,
      limit,
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  protected async paginate<T>(
    query: () => Promise<T[]>,
    count: () => Promise<number>,
    options?: PaginationOptions
  ): Promise<PaginationResult<T>> {
    const { page, limit } = this.getPagination(options);

    const [data, total] = await Promise.all([
      query(),
      count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  protected ensureExists<T>(
    entity: T | null | undefined,
    message = "Resource not found."
  ): T {
    if (!entity) {
      throw AppError.notFound(message);
    }
  
    return entity;
  }


  protected ensureUnique(
    exists: boolean,
    message = "Duplicate record found."
  ) {
    if (exists) {
      throw AppError.duplicate(message);
    }
  }

  protected normalizeSearch(search?: string) {
    return search?.trim() || undefined;
  }

  protected normalizeSlug(slug: string) {
    return slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  protected async execute<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw AppError.internal(
        "Unexpected service error.",
        error
      );
    }
  }
}

export default BaseCmsService;
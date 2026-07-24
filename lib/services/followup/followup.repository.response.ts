export interface FollowUpRepositoryResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }
  
  export interface FollowUpRepositoryListResponse<T> {
    data: T[];
    success: boolean;
    total: number;
    page?: number;
    limit?: number;
    message?: string;
  }
  
  export function successResponse<T>(
    data: T,
    message?: string,
  ): FollowUpRepositoryResponse<T> {
    return {
      data,
      success: true,
      message,
    };
  }
  
  export function listSuccessResponse<T>(
    data: T[],
    total: number,
    page?: number,
    limit?: number,
    message?: string,
  ): FollowUpRepositoryListResponse<T> {
    return {
      data,
      success: true,
      total,
      page,
      limit,
      message,
    };
  }
  
  export function errorResponse(
    message: string,
  ): {
    success: false;
    message: string;
  } {
    return {
      success: false,
      message,
    };
  }
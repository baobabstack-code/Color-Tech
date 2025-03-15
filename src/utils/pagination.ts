import { Request, Response, NextFunction } from 'express';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Pagination result interface
export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
  totalPages?: number;
  totalItems?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

/**
 * Extract pagination parameters from request query
 * @param req Express request object
 * @returns Pagination parameters
 */
export const getPaginationParams = (req: Request): PaginationResult => {
  // Get page and limit from query parameters
  const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
  let limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
  
  // Ensure limit doesn't exceed maximum
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }
  
  // Calculate offset
  const offset = (page - 1) * limit;
  
  return {
    page,
    limit,
    offset
  };
};

/**
 * Add pagination metadata to response
 * @param result Pagination result
 * @param totalItems Total number of items
 * @returns Pagination result with metadata
 */
export const addPaginationMetadata = (result: PaginationResult, totalItems: number): PaginationResult => {
  const totalPages = Math.ceil(totalItems / result.limit);
  
  return {
    ...result,
    totalItems,
    totalPages,
    hasNextPage: result.page < totalPages,
    hasPrevPage: result.page > 1
  };
};

/**
 * Create pagination middleware
 * @param options Optional pagination options
 */
export const paginationMiddleware = (options?: { maxLimit?: number, defaultLimit?: number }) => {
  const maxLimit = options?.maxLimit || MAX_LIMIT;
  const defaultLimit = options?.defaultLimit || DEFAULT_LIMIT;
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Get page and limit from query parameters
    const page = Math.max(parseInt(req.query.page as string) || DEFAULT_PAGE, 1);
    let limit = parseInt(req.query.limit as string) || defaultLimit;
    
    // Ensure limit doesn't exceed maximum
    if (limit > maxLimit) {
      limit = maxLimit;
    }
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Add pagination to request object
    (req as any).pagination = {
      page,
      limit,
      offset
    };
    
    next();
  };
};

/**
 * Generate pagination SQL
 * @param pagination Pagination parameters
 * @returns SQL string for pagination
 */
export const getPaginationSQL = (pagination: PaginationResult): string => {
  return `LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
};

/**
 * Format paginated response
 * @param data Data to include in response
 * @param pagination Pagination metadata
 * @returns Formatted response object
 */
export const paginatedResponse = (data: any[], pagination: PaginationResult) => {
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage
    }
  };
};

export default {
  getPaginationParams,
  addPaginationMetadata,
  paginationMiddleware,
  getPaginationSQL,
  paginatedResponse
}; 
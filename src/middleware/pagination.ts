import { Request } from 'express';

/**
 * Pagination result interface
 */
export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Middleware to handle pagination parameters
 * @param req Express request object
 * @returns Pagination parameters (page, limit, offset)
 */
export const paginationMiddleware = (req: Request): PaginationResult => {
  // Get pagination parameters from query string
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  // Ensure page and limit are positive numbers
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 100); // Limit between 1 and 100
  
  // Calculate offset
  const offset = (validPage - 1) * validLimit;
  
  return {
    page: validPage,
    limit: validLimit,
    offset
  };
};

export default paginationMiddleware; 
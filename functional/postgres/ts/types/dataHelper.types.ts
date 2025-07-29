export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  offset: number;
  limit: number;
}
export type CalculatePaginationType = {
  totalItems: number | null;
  currentPage: number | null;
  limit: number | null;
};
export interface PageLimitQuery {
  page?: string;  // query params are always strings or undefined
  limit?: string;
}

export interface PageLimitResult {
  page: number;
  limit: number;
}
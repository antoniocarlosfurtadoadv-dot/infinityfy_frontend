// Base pagination interface
export interface IPagination<T = unknown> {
  total: number;
  currentPage: number;
  perPage: number;
  limit: number;
  data: T[];
  totalPages?: number;
}

// Pagination params for requests
export interface IPaginationParams {
  page?: number;
  limit?: number;
}

// Helper to create empty pagination response
export function createEmptyPagination<T>(): IPagination<T> {
  return {
    data: [],
    total: 0,
    currentPage: 1,
    perPage: 10,
    limit: 10,
    totalPages: 0,
  };
}

// Helper to validate pagination data
export function isPaginationValid<T>(data: unknown): data is IPagination<T> {
  return (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray((data as IPagination<T>).data) &&
    "total" in data &&
    typeof (data as IPagination<T>).total === "number" &&
    "currentPage" in data &&
    typeof (data as IPagination<T>).currentPage === "number" &&
    "limit" in data &&
    typeof (data as IPagination<T>).limit === "number"
  );
}

// Generic API response wrapper
export interface ISuccess<T> {
  success: boolean;
  payload?: T;
  message?: string;
}

// API error response
export interface IError {
  statusCode: number;
  message: string;
  error: string | Record<string, unknown>;
}

// Union type for all possible API responses
export type ApiResponse<T> = ISuccess<T> | IError;

// Type guard for success responses
export function isSuccessResponse<T>(response: unknown): response is ISuccess<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    "payload" in response &&
    (response as ISuccess<T>).success === true
  );
}

// Type guard for error responses
export function isErrorResponse(response: unknown): response is IError {
  return (
    typeof response === "object" &&
    response !== null &&
    "statusCode" in response &&
    "message" in response &&
    "error" in response
  );
}

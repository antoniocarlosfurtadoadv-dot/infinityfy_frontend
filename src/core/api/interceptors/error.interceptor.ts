import type { ISuccess } from "../types";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public error?: string | Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function applyErrorInterceptor<T>(response: Response): Promise<ISuccess<T>> {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    let errorDetails: string | Record<string, unknown> | undefined;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorDetails = errorData.error || errorData;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(response.status, errorMessage, errorDetails);
  }

  try {
    const data = await response.json();

    // If the response already has the ISuccess structure, return it
    if (typeof data === "object" && data !== null && "success" in data) {
      return data as ISuccess<T>;
    }

    // Otherwise, wrap the data in the ISuccess structure
    return {
      success: true,
      payload: data as T,
    };
  } catch {
    // If response has no body or is not JSON, return success without payload
    return {
      success: true,
    };
  }
}

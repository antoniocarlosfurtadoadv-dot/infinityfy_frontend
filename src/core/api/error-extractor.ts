/**
 * Extracts error message from various API error response shapes
 * Supports: error.message, error.data.message, error.response.data.message, and nested structures
 */
export function extractErrorMessage(error: unknown): string | undefined {
  // Direct message property
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  // error.data.message shape
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as Record<string, unknown>).data === "object" &&
    (error as Record<string, unknown>).data !== null
  ) {
    const data = (error as Record<string, unknown>).data as Record<
      string,
      unknown
    >;
    if (
      "message" in data &&
      typeof data.message === "string" &&
      data.message.trim()
    ) {
      return data.message;
    }
  }

  // error.response.data.message shape
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as Record<string, unknown>).response === "object" &&
    (error as Record<string, unknown>).response !== null
  ) {
    const response = (error as Record<string, unknown>).response as Record<
      string,
      unknown
    >;
    if (
      "data" in response &&
      typeof response.data === "object" &&
      response.data !== null
    ) {
      const data = response.data as Record<string, unknown>;
      if (
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim()
      ) {
        return data.message;
      }
    }
  }

  return undefined;
}

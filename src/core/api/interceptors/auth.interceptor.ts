import { getToken, isTokenExpired } from "../../services/storage.service";

let isRefreshing = false;
let _refreshPromise: Promise<string | null> | null = null;

export function applyAuthInterceptor(): HeadersInit {
  const token = getToken();

  // If token is expired, handle refresh in background
  // The request will go through with the old token and fail with 401
  // The error interceptor should handle the retry logic
  if (token && isTokenExpired() && !isRefreshing) {
    isRefreshing = true;
    // Dynamic import to avoid circular dependency
    import("../../services/auth.service").then(({ AuthService }) => {
      _refreshPromise = AuthService.refreshToken().finally(() => {
        isRefreshing = false;
        _refreshPromise = null;
      });
    });
  }

  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

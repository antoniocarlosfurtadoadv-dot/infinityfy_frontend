import { jwtDecode } from "jwt-decode";

const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  TOKEN_EXPIRY: "token_expiry",
} as const;

interface ITokenPayload {
  exp?: number;
}

// Token Management
export function saveToken(token: string, expiresIn?: number) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);

    let expiryTime: number | null = null;

    if (expiresIn) {
      expiryTime = Date.now() + expiresIn * 1000;
    } else {
      try {
        const decodedToken = jwtDecode<ITokenPayload>(token);
        if (decodedToken.exp) {
          expiryTime = decodedToken.exp * 1000;
        }
      } catch {
        expiryTime = null;
      }
    }

    if (expiryTime) {
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
    }
  } catch (error) {
    console.error("Failed to save token:", error);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
}

export function removeToken() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  } catch (error) {
    console.error("Failed to remove token:", error);
  }
}

export function isTokenExpired(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return true;

    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!expiry) return false; // No expiry set, assume valid

    return Date.now() > Number.parseInt(expiry, 10);
  } catch (error) {
    console.error("Failed to check token expiry:", error);
    return true;
  }
}

// Refresh Token Management
export function saveRefreshToken(refreshToken: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error("Failed to save refresh token:", error);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error("Failed to get refresh token:", error);
    return null;
  }
}

export function removeRefreshToken() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error("Failed to remove refresh token:", error);
  }
}

// User Management
export function saveUser<T>(user: T) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user:", error);
  }
}

export function getUser<T>(): T | null {
  if (typeof window === "undefined") return null;

  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? (JSON.parse(user) as T) : null;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}

export function removeUser() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error("Failed to remove user:", error);
  }
}

// Clear all auth data
export function clearAuthData() {
  removeToken();
  removeRefreshToken();
  removeUser();
}



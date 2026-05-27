import type { IUser } from "@/shared/types/user";
import { api } from "../api/http";
import { extractErrorMessage } from "../api/error-extractor";
import {
  saveToken,
  removeToken,
  saveRefreshToken,
  removeRefreshToken,
  getRefreshToken,
} from "./storage.service";
import type {
  FirstTimeChangePasswordRequestDTO,
  FirstTimeChangePasswordResponseDTO,
  VerifyLoginCodeRequestDTO,
  VerifyLoginCodeResponseDTO,
  ForgotPasswordResponseDTO,
  VerifyResetCodeRequestDTO,
  VerifyResetCodeResponseDTO,
  ResetPasswordRequestDTO,
  ResetPasswordResponseDTO,
  FirstAccessValidateRequestDTO,
  FirstAccessValidateResponseDTO,
  FirstAccessVerifyRequestDTO,
  FirstAccessVerifyResponseDTO,
  FirstAccessCompleteRequestDTO,
  FirstAccessCompleteResponseDTO,
  FirstAccessRequestDTO,
  FirstAccessRequestResponseDTO,
} from "@/shared/types/auth";

export interface ILoginCredentials {
  email: string;
  password: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ILoginResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: IUser;
}

export type ILoginResult = ILoginResponse;

export interface IRefreshTokenResponse {
  access_token: string;
  expires_in?: number;
}

async function parseError(response: Response): Promise<never> {
  let message = "Ocorreu um erro inesperado";

  try {
    // Try to surface the backend message first for better UX feedback.
    const errorData = await response.json();
    const extractedMessage = extractErrorMessage(errorData);
    if (extractedMessage) {
      message = extractedMessage;
    } else if (
      typeof errorData === "object" &&
      errorData !== null &&
      "message" in errorData &&
      typeof (errorData as Record<string, unknown>).message === "string"
    ) {
      message = (errorData as Record<string, unknown>).message as string;
    }
  } catch {}

  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNormalizedKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function toStringIfPrimitive(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

function findStringByCanonicalKeys(
  source: unknown,
  canonicalKeys: readonly string[],
  depth = 0,
): string | undefined {
  if (!isRecord(source) || depth > 4) {
    return undefined;
  }

  const normalizedCandidates = canonicalKeys.map(toNormalizedKey);

  for (const [key, value] of Object.entries(source)) {
    const normalizedKey = toNormalizedKey(key);
    if (normalizedCandidates.includes(normalizedKey)) {
      const primitiveValue = toStringIfPrimitive(value);
      if (primitiveValue) {
        return primitiveValue;
      }
    }
  }

  for (const value of Object.values(source)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const nestedMatch = findStringByCanonicalKeys(
          item,
          canonicalKeys,
          depth + 1,
        );
        if (nestedMatch) {
          return nestedMatch;
        }
      }
      continue;
    }

    const nestedMatch = findStringByCanonicalKeys(
      value,
      canonicalKeys,
      depth + 1,
    );
    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return undefined;
}

function normalizeForgotPasswordResponse(
  raw: unknown,
): ForgotPasswordResponseDTO {
  const resetToken = findStringByCanonicalKeys(raw, [
    "resetToken",
    "reset_token",
    "resettoken",
  ]);

  return {
    success: true,
    message: "Código enviado com sucesso",
    payload: {
      message: "Se o e-mail existir, um código será enviado.",
      ...(resetToken ? { resetToken } : {}),
    },
  };
}

export const AuthService = {
  login: async (credentials: ILoginCredentials): Promise<ILoginResult> => {
    const response = await api.post<ILoginResult>("/auth/signin", credentials);

    // Normal login flow - save tokens
    const { access_token, refresh_token, expires_in } = response;

    saveToken(access_token, expires_in);
    if (refresh_token) {
      saveRefreshToken(refresh_token);
    }

    return response;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // Ignore errors — always clear local auth data
    } finally {
      removeToken();
      removeRefreshToken();
    }
  },

  refreshToken: async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await api.post<IRefreshTokenResponse>("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const { access_token, expires_in } = response;
      saveToken(access_token, expires_in);

      return access_token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      removeToken();
      removeRefreshToken();
      return null;
    }
  },

  me: async (): Promise<IUser> => {
    return await api.get<IUser>("/auth/me");
  },

  verifyCode: async (
    data: VerifyLoginCodeRequestDTO,
  ): Promise<VerifyLoginCodeResponseDTO> => {
    const response = await fetch(`${BASE_URL}/auth/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return parseError(response);
    }

    return response.json();
  },

  firstTimeChangePassword: async (
    data: FirstTimeChangePasswordRequestDTO,
  ): Promise<FirstTimeChangePasswordResponseDTO> => {
    const response = await fetch(
      `${BASE_URL}/auth/first-time-change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      return parseError(response);
    }

    return response.json();
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponseDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.status >= 500) {
        throw new Error("Não foi possível enviar o código. Tente novamente.");
      }

      const raw = await response.json().catch(() => null);
      return normalizeForgotPasswordResponse(raw);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Não foi possível enviar o código. Tente novamente.");
    }
  },

  verifyResetCode: async (
    data: VerifyResetCodeRequestDTO,
  ): Promise<VerifyResetCodeResponseDTO> => {
    const response = await fetch(`${BASE_URL}/auth/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return parseError(response);
    return response.json() as Promise<VerifyResetCodeResponseDTO>;
  },

  resetPassword: async (
    data: ResetPasswordRequestDTO,
  ): Promise<ResetPasswordResponseDTO> => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return parseError(response);
    }

    return response.json();
  },

  validateFirstAccess: async (
    data: FirstAccessValidateRequestDTO,
  ): Promise<FirstAccessValidateResponseDTO> => {
    const response = await fetch(`${BASE_URL}/auth/first-access/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return parseError(response);
    return response.json() as Promise<FirstAccessValidateResponseDTO>;
  },

  // Step 1: verify temporary password and terms acceptance
  verifyFirstAccess: async (
    data: FirstAccessVerifyRequestDTO,
  ): Promise<FirstAccessVerifyResponseDTO> => {
    const response = await fetch(`${BASE_URL}/auth/first-access/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return parseError(response);
    return response.json() as Promise<FirstAccessVerifyResponseDTO>;
  },

  // Step 2: set the new password
  completeFirstAccess: async (
    data: FirstAccessCompleteRequestDTO,
  ): Promise<FirstAccessCompleteResponseDTO> => {
    const response = await fetch(`${BASE_URL}/auth/first-access/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return parseError(response);
    return response.json() as Promise<FirstAccessCompleteResponseDTO>;
  },

  // Resend first-access link
  requestFirstAccess: async (
    data: FirstAccessRequestDTO,
  ): Promise<FirstAccessRequestResponseDTO> => {
    const response = await fetch(`${BASE_URL}/auth/first-access/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return parseError(response);
    return response.json() as Promise<FirstAccessRequestResponseDTO>;
  },
};

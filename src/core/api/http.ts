import { env } from "../config/env";
import { dispatchAuthUnauthorizedEvent } from "../auth/auth-events";
import { clearAuthData } from "../services/storage.service";
import { applyAuthInterceptor } from "./interceptors/auth.interceptor";
import { ApiError, applyErrorInterceptor } from "./interceptors/error.interceptor";

export interface IRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class Http {
  constructor(private baseURL: string) {}

  private headers(): HeadersInit {
    return applyAuthInterceptor();
  }

  private buildUrl(url: string, params?: Record<string, string | number | boolean | undefined>): string {
    if (!params) return url;

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  async request<T>(url: string, options: IRequestConfig = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const finalUrl = this.buildUrl(url, params);

    const finalOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.headers(),
        ...(fetchOptions.headers || {}),
      },
    };

    const response = await fetch(this.baseURL + finalUrl, finalOptions);

    let result;
    try {
      result = await applyErrorInterceptor<T>(response);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        clearAuthData();
        dispatchAuthUnauthorizedEvent();

      }
      throw err;
    }

    // Return the payload directly, which is the data the services expect
    return result.payload as T;
  }

  get<T>(url: string, options?: IRequestConfig): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  post<T>(url: string, body: unknown, options?: IRequestConfig): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData ? options?.headers : { "Content-Type": "application/json", ...options?.headers },
    });
  }

  put<T>(url: string, body: unknown, options?: IRequestConfig): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData ? options?.headers : { "Content-Type": "application/json", ...options?.headers },
    });
  }

  patch<T>(url: string, body: unknown, options?: IRequestConfig): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData ? options?.headers : { "Content-Type": "application/json", ...options?.headers },
    });
  }

  delete<T>(url: string, options?: IRequestConfig): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}

export const api = new Http(env.apiUrl);

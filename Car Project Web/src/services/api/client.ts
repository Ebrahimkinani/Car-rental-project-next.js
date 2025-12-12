/**
 * API Client
 * Centralized HTTP client for making API requests
 */

import { API_URL } from "@/lib/constants";
import type { ApiResponse, RequestConfig } from "@/types";

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken() {
    delete this.defaultHeaders["Authorization"];
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, params } = config;

    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "An error occurred",
        };
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  /**
   * HTTP Methods
   */
  async get<T>(endpoint: string, config?: Omit<RequestConfig, "method" | "body">) {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, "method">) {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  async put<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, "method">) {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  async patch<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, "method">) {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, "method" | "body">) {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_URL);


/**
 * User API Service
 * Handles all user-related API calls
 */

import { apiClient } from "./client";
import type { User, ApiResponse } from "@/types";

export const userService = {
  /**
   * Get all users
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>("/users");
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * Create new user
   */
  async createUser(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.post<User>("/users", data);
  },

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`/users/${id}`, data);
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/${id}`);
  },
};


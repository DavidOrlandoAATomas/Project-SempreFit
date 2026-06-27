import { api } from "./api";
import {
  UpdateProfileDTO,
  ChangePasswordDTO,
  User
} from "@/types/user";

// Tipos auxiliares para consistência da API
type ApiResponse<T> = {
  data: T;
};

export const UserService = {
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/users/profile");
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileDTO): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      "/users/profile",
      data
    );
    return response.data.data;
  },

  async changePassword(data: ChangePasswordDTO): Promise<void> {
    await api.post("/users/change-password", data);
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>("/users");
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async promoteUser(id: string) {
  const response = await api.patch(`/users/${id}/promote`);
  return response.data.data;
},

async demoteUser(id: string) {
  const response = await api.patch(`/users/${id}/demote`);
  return response.data.data;
},
  async getAdminStats() {
    const response = await api.get("/users/admin/stats");
    return response.data.data || response.data;
  }

};
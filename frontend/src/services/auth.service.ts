import { api } from "./api";
import {RegisterDTO} from "@/types/auth"
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export const AuthService = {

  register(data: RegisterDTO) {

    return api.post(
      "/auth/register",
      data
    );
  },

  login(data: LoginRequest) {

    return api.post(
      "/auth/login",
      data
    );
  },

  refresh(data: RefreshRequest) {

    return api.post(
      "/auth/refresh",
      data
    );
  },

  logout() {

    return api.post(
      "/auth/logout"
    );
  }
};
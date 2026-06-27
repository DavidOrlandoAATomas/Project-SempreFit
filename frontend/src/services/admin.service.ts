import { api } from "./api";

export const AdminService = {

  getUsers() {

    return api.get(
      "/admin/users"
    );
  }
};
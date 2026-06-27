export interface User {

  id: string;

  name: string;

  email: string;

  role: string;

  height?: number;

  weight?: number;

  birthDate?: string;

  gender?: string;

  goal?: string;
}

export interface UpdateProfileDTO {

  name?: string;

  height?: number;

  weight?: number;

  birthDate?: string;

  gender?: string;

  goal?: string;
}

export interface ChangePasswordDTO {

  oldPassword: string;

  newPassword: string;
}
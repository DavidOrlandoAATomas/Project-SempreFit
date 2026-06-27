export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface JwtPayload {
  userId: string;
  role?: string;
  iat?: number;
  exp?: number;
}
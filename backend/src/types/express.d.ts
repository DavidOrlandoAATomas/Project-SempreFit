import "express";

declare global {
  namespace Express {
  export interface Request {
    user: {
      userId: string;
      role: string;
      iat?: number;
      exp?: number;
    };
  }
}
}
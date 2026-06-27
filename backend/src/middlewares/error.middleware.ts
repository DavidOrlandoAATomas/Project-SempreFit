import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(" ERROR:", err);

  return res.status(400).json({
    data: null,
    error: {
      message: err.message || "Unknown error",
      details: err.errors || null,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    },
    meta: null
  });
}
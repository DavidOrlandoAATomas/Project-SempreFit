// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      iat?: number;
      exp?: number;
    };
    
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
console.log("Admin check - User role:", req.user?.role);
  
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Name can only contain letters and spaces'),
    
    email: z.string()
      .email('Invalid email format')
      .min(5, 'Email must be at least 5 characters')
      .max(100, 'Email must be at most 100 characters'),
    
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be at most 50 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
    
    height: z.number()
      .positive('Height must be positive')
      .min(50, 'Height must be at least 50cm')
      .max(250, 'Height must be at most 250cm')
      .optional(),
    
    weight: z.number()
      .positive('Weight must be positive')
      .min(10, 'Weight must be at least 10kg')
      .max(300, 'Weight must be at most 300kg')
      .optional(),
    
    birthDate: z.string()
      .datetime({ message: 'Invalid date format' })
      .transform((val) => new Date(val))
      .optional(),
    
    gender: z.enum(['MALE', 'FEMALE'], {
      message: 'Gender must be MALE or FEMALE'
    }).optional(),
    
    goal: z.enum(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE'], {
      message: 'Goal must be WEIGHT_LOSS, MUSCLE_GAIN or MAINTENANCE'
    }).optional(),
});

export const loginSchema = z.object({
    email: z.string()
      .email('Invalid email format')
      .min(1, 'Email is required'),
    
    password: z.string()
      .min(1, 'Password is required')
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string()
      .min(1, 'Refresh token is required')
});
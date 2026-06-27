// validations/user.validation.ts
import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .optional(),
    email: z.string()
      .email('Invalid email format')
      .optional(),
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
      .datetime()
      .transform(str => new Date(str))
      .optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    goal: z.enum(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE']).optional(),
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
  })
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format')
  })
});
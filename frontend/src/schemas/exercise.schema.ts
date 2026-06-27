import { z } from 'zod';

export const createExerciseSchema = z.object({
    activity: z.string()
      .min(1, 'Activity name is required')
      .min(2, 'Activity name must be at least 2 characters')
      .max(100, 'Activity name must be at most 100 characters'),
    
    duration: z.number()
      .int('Duration must be an integer')
      .positive('Duration must be positive')
      .min(1, 'Duration must be at least 1 minute')
      .max(1440, 'Duration cannot exceed 1440 minutes (24 hours)'),
    
    caloriesBurned: z.number()
      .int('Calories must be an integer')
      .positive('Calories burned must be positive')
      .min(1, 'Calories burned must be at least 1')
      .max(5000, 'Calories burned cannot exceed 5000')
});

export const updateExerciseSchema = z.object({
    activity: z.string()
      .min(2, 'Activity name must be at least 2 characters')
      .max(100, 'Activity name must be at most 100 characters')
      .optional(),
    
    duration: z.number()
      .int('Duration must be an integer')
      .positive('Duration must be positive')
      .min(1, 'Duration must be at least 1 minute')
      .max(1440, 'Duration cannot exceed 1440 minutes (24 hours)')
      .optional(),
    
    caloriesBurned: z.number()
      .int('Calories must be an integer')
      .positive('Calories burned must be positive')
      .min(1, 'Calories burned must be at least 1')
      .max(5000, 'Calories burned cannot exceed 5000')
      .optional(),
});

export const exerciseIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid exercise ID format')
  })
});
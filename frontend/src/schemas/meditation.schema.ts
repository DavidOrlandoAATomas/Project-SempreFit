import { z } from 'zod';

export const createMeditationSchema = z.object({
    mood: z.number()
      .int('Mood must be an integer')
      .min(1, 'Mood must be at least 1 (very bad)')
      .max(10, 'Mood must be at most 10 (excellent)'),
    
    duration: z.number()
      .int('Duration must be an integer')
      .positive('Duration must be positive')
      .min(1, 'Duration must be at least 1 minute')
      .max(480, 'Duration cannot exceed 480 minutes (8 hours)'),
    
    notes: z.string()
      .max(500, 'Notes must be at most 500 characters')
      .optional()
});

export const updateMeditationSchema = z.object({
    mood: z.number()
      .int('Mood must be an integer')
      .min(1, 'Mood must be at least 1 (very bad)')
      .max(10, 'Mood must be at most 10 (excellent)')
      .optional(),
    
    duration: z.number()
      .int('Duration must be an integer')
      .positive('Duration must be positive')
      .min(1, 'Duration must be at least 1 minute')
      .max(480, 'Duration cannot exceed 480 minutes (8 hours)')
      .optional(),
    
    notes: z.string()
      .max(500, 'Notes must be at most 500 characters')
      .optional()
});

export const meditationIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid meditation ID format')
  })
});
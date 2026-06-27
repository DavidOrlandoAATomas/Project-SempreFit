import { z } from "zod";

export const exerciseSchema = z.object({
  activity: z.string().min(2),
  duration: z.number().positive(),
  caloriesBurned: z.number().positive()
});
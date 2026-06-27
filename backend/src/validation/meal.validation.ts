import { z } from "zod";

export const mealSchema = z.object({
  name: z.string().min(2),
  calories: z.number().positive(),
  category: z.string().min(2)
});
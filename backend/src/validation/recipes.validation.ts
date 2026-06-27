import { z } from "zod";

export const recipeSchema = z.object({
  name: z.string().min(2),
  ingredients: z.array(z.string()),
  instructions: z.string(),
  calories: z.number().positive()
});
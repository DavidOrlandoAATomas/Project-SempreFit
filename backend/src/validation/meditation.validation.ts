import { z } from "zod";

export const meditationSchema = z.object({
  mood: z.enum(["VERY_BAD", "BAD", "OK", "GOOD", "EXCELLENT"]),
  meditationTime: z.number().positive(),
  notes: z.string().optional()
});
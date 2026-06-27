import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  height: z.number().positive(),
  weight: z.number().positive(),
  birthDate: z.string().datetime(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  goal: z.enum(["WEIGHT_LOSS", "MUSCLE_GAIN", "MAINTENANCE"])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
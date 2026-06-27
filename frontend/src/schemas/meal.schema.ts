import { z } from 'zod';

// Definir os enums como constantes
const MealCategoryEnum = z.enum(['PEQUENO-ALMOÇO', 'LANCHE', 'ALMOÇO', 'JANTAR', 'SOBREMESA', 'BEVERAGE']);

export const createMealSchema = z.object({
    name: z.string()
      .min(1, 'Nome da refeoção é obrigatório')
      .min(2, 'O nome da refeição tem que ter pelo menos 2 caracteres')
      .max(100, 'Refeição tem que ter no máximo 100 caracteres'),
    
    calories: z.number()
      .int('Calorias tem que ser inteiro')
      .positive('Calorias deve ser positivo')
      .min(1, 'Calorias tem que pelo menos 1')
      .max(2000, 'Calorias não pode exceder 2000 por refeição'),
    
    category: MealCategoryEnum});

export const updateMealSchema = z.object({
    name: z.string()
      .min(2, 'O nome da refeição tem que ter pelo menos 2 caracteres')
      .max(100, 'Refeição tem que ter no máximo 100 caracteres')
      .optional(),
    
    calories: z.number()
      .int('Calorias tem que ser inteiro')
      .positive('Calorias deve ser positivo')
      .min(1, 'Calorias tem que pelo menos 1')
      .max(2000, 'Calorias não pode exceder 2000 por refeição')
      .optional(),
    
    category: MealCategoryEnum.optional()});

export const mealIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Formato ID inválido ')
  })
});
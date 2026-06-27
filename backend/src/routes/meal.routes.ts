// routes/meal.routes.ts
import { Router } from 'express';
import { MealController } from '../controllers/meal.controller';
import { validate } from '../middlewares/validation.middleware';
import { createMealSchema, updateMealSchema, mealIdParamSchema } from '../schemas/meal.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const mealController = new MealController();

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Meal management endpoints
 * 
 * components:
 *   schemas:
 *     Meal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         calories:
 *           type: integer
 *         category:
 *           type: string
 *           enum: [BREAKFAST, LUNCH, DINNER, SNACK, DESSERT, BEVERAGE]
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

router.use(authMiddleware);

router.post(
  '/',
  validate(createMealSchema),
  mealController.create.bind(mealController)
);

router.get(
  '/',
  mealController.findAll.bind(mealController)
);

router.get(
  '/:id',
  validate(mealIdParamSchema),
  mealController.findById.bind(mealController)
);

router.put(
  '/:id',
  validate(updateMealSchema),
  mealController.update.bind(mealController)
);

router.delete(
  '/:id',
  validate(mealIdParamSchema),
  mealController.delete.bind(mealController)
);

export default router;
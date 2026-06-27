// routes/exercise.routes.ts
import { Router } from 'express';
import { ExerciseController } from '../controllers/exercise.controller';
import { validate } from '../middlewares/validation.middleware';
import { createExerciseSchema, updateExerciseSchema, exerciseIdParamSchema } from '../schemas/exercise.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const exerciseController = new ExerciseController();

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Exercise management endpoints
 * 
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         activity:
 *           type: string
 *         duration:
 *           type: integer
 *         caloriesBurned:
 *           type: integer
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
  validate(createExerciseSchema),
  exerciseController.create.bind(exerciseController)
);

router.get(
  '/',
  exerciseController.findAll.bind(exerciseController)
);

router.get(
  '/stats',
  exerciseController.getStats.bind(exerciseController)
);

router.put(
  '/:id',
  validate(updateExerciseSchema),
  exerciseController.update.bind(exerciseController)
);

router.delete(
  '/:id',
  validate(exerciseIdParamSchema),
  exerciseController.delete.bind(exerciseController)
);

export default router;
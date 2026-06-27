// routes/meditation.routes.ts
import { Router } from 'express';
import { MeditationController } from '../controllers/meditation.controller';
import { validate } from '../middlewares/validation.middleware';
import { createMeditationSchema, updateMeditationSchema, meditationIdParamSchema } from '../schemas/meditation.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const meditationController = new MeditationController();

/**
 * @swagger
 * tags:
 *   name: Meditations
 *   description: Meditation management endpoints
 * 
 * components:
 *   schemas:
 *     Meditation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         mood:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         duration:
 *           type: integer
 *         notes:
 *           type: string
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
  validate(createMeditationSchema),
  meditationController.create.bind(meditationController)
);

router.get(
  '/',
  meditationController.findAll.bind(meditationController)
);

router.get(
  '/stats',
  meditationController.getStats.bind(meditationController)
);

router.get(
  '/weekly-trend',
  meditationController.getWeeklyTrend.bind(meditationController)
);

router.put(
  '/:id',
  validate(updateMeditationSchema),
  meditationController.update.bind(meditationController)
);

router.delete(
  '/:id',
  validate(meditationIdParamSchema),
  meditationController.delete.bind(meditationController)
);

export default router;
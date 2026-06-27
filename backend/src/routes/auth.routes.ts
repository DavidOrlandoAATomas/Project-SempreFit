// routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post(
  '/register',
  validate(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  validate(loginSchema),
  authController.login.bind(authController)
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refresh.bind(authController)
);

router.post(
  '/logout',
  authMiddleware,
  authController.logout.bind(authController)
);

export default router;
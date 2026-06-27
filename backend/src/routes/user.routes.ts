// routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { updateUserSchema, changePasswordSchema, userIdParamSchema } from '../schemas/user.schema';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         height:
 *           type: number
 *         weight:
 *           type: number
 *         birthDate:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         goal:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  '/profile',
  authMiddleware,
  userController.getProfile.bind(userController)
);

router.put(
  '/profile',
  authMiddleware,
  validate(updateUserSchema),
  userController.updateProfile.bind(userController)
);

router.post(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  userController.changePassword.bind(userController)
);

router.get(
  '/admin/stats',
  authMiddleware,
  adminMiddleware,
  userController.getAdminStats.bind(userController)
);

// Admin only routes
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  userController.getAllUsers.bind(userController)
);

router.patch(
  "/:id/promote",
  authMiddleware,
  adminMiddleware,
  userController.promote.bind(userController)
);

router.patch(
  "/:id/demote",
  authMiddleware,
  adminMiddleware,
  userController.demote.bind(userController)
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(userIdParamSchema),
  userController.deleteUser.bind(userController)
);

export default router;
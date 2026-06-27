// controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

const authService = new AuthService();
const userService = UserService;

export class AuthController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: Password123
   *               height:
   *                 type: number
   *                 example: 175
   *               weight:
   *                 type: number
   *                 example: 70
   *               birthDate:
   *                 type: string
   *                 format: date-time
   *                 example: 1990-01-01T00:00:00.000Z
   *               gender:
   *                 type: string
   *                 enum: [MALE, FEMALE]
   *                 example: MALE
   *               goal:
   *                 type: string
   *                 enum: [WEIGHT_LOSS, MUSCLE_GAIN, MAINTENANCE]
   *                 example: WEIGHT_LOSS
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: User already exists
   */
  async register(req: Request, res: Response) {
    try {
      const user = await userService.register(req.body);
      console.log("BODY:", req.body);
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error: any) {
      const status = error.message === 'User already exists' ? 409 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }
  

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: Password123
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                     refreshToken:
   *                       type: string
   *                     user:
   *                       type: object
   *       401:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({
        success: true,
        data: result,
        message: 'Login successful'
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: New access token generated
   *       401:
   *         description: Invalid refresh token
   */
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Logout successful
   *       401:
   *         description: Unauthorized
   */
  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user.userId;
      await authService.logout(userId, refreshToken);
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
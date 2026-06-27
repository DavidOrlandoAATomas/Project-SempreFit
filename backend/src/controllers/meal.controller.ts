import { Request, Response } from 'express';
import { MealService } from '../services/meal.service';

const mealService = new MealService();

export class MealController {
  /**
   * @swagger
   * /api/meals:
   *   post:
   *     summary: Create a new meal
   *     tags: [Meals]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - calories
   *               - category
   *             properties:
   *               name:
   *                 type: string
   *                 example: Grilled Chicken Salad
   *               calories:
   *                 type: integer
   *                 example: 450
   *               category:
   *                 type: string
   *                 enum: [BREAKFAST, LUNCH, DINNER, SNACK, DESSERT, BEVERAGE]
   *                 example: LUNCH
   *     responses:
   *       201:
   *         description: Meal created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Meal'
   *                 message:
   *                   type: string
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  async create(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const meal = await mealService.create(req.body, userId);
      res.status(201).json({
        success: true,
        data: meal,
        message: 'Meal created successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /meals:
   *   get:
   *     summary: Get all user meals
   *     tags: [Meals]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of meals
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Meal'
   */
  async findAll(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const meals = await mealService.findAll(userId);
      res.json({
        success: true,
        data: meals
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /meals/{id}:
   *   get:
   *     summary: Get meal by ID
   *     tags: [Meals]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Meal ID
   *     responses:
   *       200:
   *         description: Meal found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Meal'
   *       404:
   *         description: Meal not found
   */
  async findById(req: Request, res: Response) {
    try {
      const id  = req.params.id as string;
      const userId = req.user.userId;
      const meal = await mealService.findById(id, userId);
      res.json({
        success: true,
        data: meal
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /meals/{id}:
   *   put:
   *     summary: Update meal
   *     tags: [Meals]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               calories:
   *                 type: integer
   *               category:
   *                 type: string
   *     responses:
   *       200:
   *         description: Meal updated successfully
   *       404:
   *         description: Meal not found
   *       403:
   *         description: Unauthorized
   */
 async update(req: Request, res: Response) {

  console.log("================================");
  console.log("UPDATE FOI CHAMADO");
  console.log("PARAMS:", req.params);
  console.log("BODY:", req.body);
  console.log("================================");
  try {
console.log("PARAMS:", req.params);
console.log("BODY:", req.body);
    const id = req.params.id as string; 
    const userId = req.user.userId;

    const meal = await mealService.update(id, req.body, userId);

    res.json({
      success: true,
      data: meal,
      message: 'Meal updated successfully'
    });

  } catch (error: any) {
    console.error("UPDATE ERROR:", error);

    const status = error.message.includes('not found') ? 404 : 400;

    res.status(status).json({
      success: false,
      error: error.message
    });
  }
}

  /**
   * @swagger
   * /meals/{id}:
   *   delete:
   *     summary: Delete meal
   *     tags: [Meals]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Meal deleted successfully
   *       404:
   *         description: Meal not found
   *       403:
   *         description: Unauthorized
   */
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = req.user.userId;

      console.log("DELETE - ID:", id);
      console.log("DELETE - UserId:", userId);

      await mealService.delete(id, userId);
      res.json({
        success: true,
        message: 'Meal deleted successfully'
      });
    } catch (error: any) {
      console.error("DELETE ERROR:", error);
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }
}
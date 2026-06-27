import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { SpoonacularService } from '../integrations/spoonacular.service';

const router = Router();
const spoonacularService = new SpoonacularService();

router.get('/suggest', authMiddleware, async (req, res) => {
  try {
    const calories = parseInt(req.query.calories as string) || 500;
    const recipes = await spoonacularService.suggestRecipes(calories);
    
    res.json({
      success: true,
      data: recipes,
      message: `Found ${recipes.length} recipes under ${calories} calories`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
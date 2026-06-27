import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { SpoonacularService } from '../integrations/spoonacular.service';
import { GoogleHealthService } from '../integrations/googleHealth.service';



const router = Router();
const spoonacularService = new SpoonacularService();
const googleHealthService = new GoogleHealthService();



// ============ SPOONACULAR ============
router.get('/recipes/suggest', authMiddleware, async (req, res) => {
  try {
    const calories = parseInt(req.query.calories as string) || 500;
    const number = parseInt(req.query.number as string) || 5;
    
    const recipes = await spoonacularService.suggestRecipes(calories, number);
    
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

router.get('/recipes/search', authMiddleware, async (req, res) => {
  try {
    const query = req.query.q as string;
    const number = parseInt(req.query.number as string) || 10;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }
    
    const recipes = await spoonacularService.searchRecipes(query, number);
    
    res.json({
      success: true,
      data: recipes
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const recipe = await spoonacularService.getRecipeById(id);
    
    res.json({
      success: true,
      data: recipe
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/recipes/by-ingredients', authMiddleware, async (req, res) => {
  try {
    const { ingredients, number = 5 } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Ingredients array is required'
      });
    }
    
    const recipes = await spoonacularService.getRecipesByIngredients(ingredients, number);
    
    res.json({
      success: true,
      data: recipes
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============ GOOGLE HEALTH API ============
router.get('/google-health/auth', authMiddleware, async (req, res) => {
  try {
    const url = googleHealthService.getAuthUrl();
    console.log("URL de autenticação gerada:", url);
    res.json({ 
      success: true,
      authUrl: url 
    });
  } catch (error: any) {
    console.error("Error getting auth URL:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to get auth URL"
    });
  }
});


router.get('/google-health/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code is required'
      });
    }
    
    console.log("Recebendo código de autorização...");
    
    const tokens = await googleHealthService.exchangeCodeForToken(code as string);
    
    console.log("Tokens obtidos com sucesso");
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const callbackUrl = `${frontendUrl}/integrations/google-health?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`;
    
    console.log("Redirecionando para:", callbackUrl);
    
    res.redirect(callbackUrl);
  } catch (error: any) {
    console.error("Callback error:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/google-health/sync', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { accessToken, startTime, endTime } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }
    
    const data = await googleHealthService.syncHealthData(userId, accessToken, startTime, endTime);
    
    res.json({
      success: true,
      data,
      message: `Health data synced successfully (${data.length} days)`
    });
  } catch (error: any) {
    console.error("Error syncing health data:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to sync health data"
    });
  }
});

router.get('/google-health/stats', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const stats = await googleHealthService.getHealthStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error("Error getting health stats:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
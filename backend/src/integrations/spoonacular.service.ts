import axios from "axios";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  sourceUrl: string;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds?: number;
    }>;
  };
  extendedIngredients?: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
  }>;
  analyzedInstructions?: Array<{
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
}

export class SpoonacularService {
  
  async suggestRecipes(calories: number, number: number = 5): Promise<Recipe[]> {
    try {
      if (!SPOONACULAR_API_KEY) {
        console.error("SPOONACULAR_API_KEY não está configurada no .env");
        throw new Error("API key not configured. Please add SPOONACULAR_API_KEY to your .env file.");
      }

      console.log("Buscando receitas com até", calories, "calorias");
      console.log("API Key:", SPOONACULAR_API_KEY.substring(0, 10) + "...");

      const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/complexSearch`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          maxCalories: calories,
          number: number,
          addRecipeInformation: true,
          addRecipeNutrition: true,
          fillIngredients: true,
          instructionsRequired: true
        },
        timeout: 10000 
      });

      console.log("Receitas encontradas:", response.data.results?.length || 0);
      return response.data.results || [];
    } catch (error: any) {
      console.error("Spoonacular API error:");
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Mensagem:", error.response.data?.message || error.response.statusText);
        console.error("Detalhes:", error.response.data);
        
        if (error.response.status === 401 || error.response.status === 403) {
          throw new Error("Invalid API key. Please check your SPOONACULAR_API_KEY.");
        }
        if (error.response.status === 429) {
          throw new Error("Too many requests. Please try again later.");
        }
        throw new Error(error.response.data?.message || "Failed to fetch recipes");
      } else if (error.code === 'ECONNABORTED') {
        throw new Error("Request timeout. Please try again.");
      } else {
        throw new Error("Failed to fetch recipes. Please try again.");
      }
    }
  }

  async searchRecipes(query: string, number: number = 10): Promise<Recipe[]> {
    try {
      if (!SPOONACULAR_API_KEY) {
        throw new Error("API key not configured");
      }

      console.log("Pesquisando receitas por:", query);

      const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/complexSearch`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          query: query,
          number: number,
          addRecipeInformation: true,
          addRecipeNutrition: true,
          fillIngredients: true,
          instructionsRequired: true
        },
        timeout: 10000
      });

      return response.data.results || [];
    } catch (error: any) {
      console.error("Spoonacular search error:", error.message);
      throw new Error("Failed to search recipes");
    }
  }

  async getRecipeById(id: number): Promise<Recipe> {
    try {
      if (!SPOONACULAR_API_KEY) {
        throw new Error("API key not configured");
      }

      console.log("Buscando receita ID:", id);

      const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${id}/information`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: true
        },
        timeout: 10000
      });

      return response.data;
    } catch (error: any) {
      console.error("Spoonacular recipe error:", error.message);
      throw new Error("Failed to fetch recipe details");
    }
  }

  async getRecipesByIngredients(ingredients: string[], number: number = 5): Promise<Recipe[]> {
    try {
      if (!SPOONACULAR_API_KEY) {
        throw new Error("API key not configured");
      }

      console.log("Buscando receitas com ingredientes:", ingredients);

      const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/findByIngredients`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          ingredients: ingredients.join(','),
          number: number,
          ranking: 2
        },
        timeout: 10000
      });

      return response.data || [];
    } catch (error: any) {
      console.error("Spoonacular ingredients error:", error.message);
      throw new Error("Failed to fetch recipes by ingredients");
    }
  }
}
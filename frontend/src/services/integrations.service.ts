// frontend/src/services/integrations.service.ts
import { api } from "./api";

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
}

export interface HealthData {
  date: string;
  steps: number;
  calories: number;
  heartRate: number;
  sleepHours: number;
  weight?: number;
}

export const IntegrationsService = {
  // ============ SPOONACULAR ============
  async suggestRecipes(calories: number = 500, number: number = 5) {
    try {
      const response = await api.get(`/integrations/recipes/suggest`, {
        params: { calories, number }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error("Erro ao buscar receitas:", error.response?.data || error.message);
      throw error;
    }
  },

  async searchRecipes(query: string, number: number = 10) {
    try {
      const response = await api.get(`/integrations/recipes/search`, {
        params: { q: query, number }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error("Erro ao pesquisar receitas:", error.response?.data || error.message);
      throw error;
    }
  },

  async getRecipeById(id: number) {
    try {
      const response = await api.get(`/integrations/recipes/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error("Erro ao buscar receita:", error.response?.data || error.message);
      throw error;
    }
  },

  async getRecipesByIngredients(ingredients: string[], number: number = 5) {
    try {
      const response = await api.post('/integrations/recipes/by-ingredients', { ingredients, number });
      return response.data.data || [];
    } catch (error: any) {
      console.error("Erro ao buscar receitas por ingredientes:", error.response?.data || error.message);
      throw error;
    }
  },

  // ============ GOOGLE HEALTH API ============
  async getGoogleHealthAuthUrl() {
    try {
      const response = await api.get('/integrations/google-health/auth');
      return response.data.authUrl;
    } catch (error) {
      console.error("Erro ao obter URL do Google Health:", error);
      throw error;
    }
  },

  async syncGoogleHealth(accessToken: string, startTime?: string, endTime?: string) {
    try {
      const response = await api.post('/integrations/google-health/sync', { 
        accessToken, 
        startTime, 
        endTime 
      });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao sincronizar Google Health:", error);
      throw error;
    }
  },

  async getHealthStats() {
    try {
      const response = await api.get('/integrations/google-health/stats');
      return response.data.data;
    } catch (error) {
      console.error("Erro ao obter estatísticas de saúde:", error);
      throw error;
    }
  }
};
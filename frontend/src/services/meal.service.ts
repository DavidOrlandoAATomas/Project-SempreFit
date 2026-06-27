// frontend/src/services/meal.service.ts
import { api } from "./api";
import { CreateMealDTO, UpdateMealDTO } from "../types/meal";

export const MealService = {

  async create(data: CreateMealDTO) {
    const response = await api.post("/meals", data);
    return response.data.data || response.data;
  },

  async findAll() {
    const response = await api.get("/meals");
    console.log("🍽️ Meal.findAll - Resposta:", response.data);
    
    // Extrair os dados corretamente
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  },

  async findById(id: string) {
    const response = await api.get(`/meals/${id}`);
    return response.data.data || response.data;
  },

  async update(id: string, data: UpdateMealDTO) {
    console.log("🔥 UPDATE REQUEST ENVIADO");
   const updateData: UpdateMealDTO = {
  ...(data.name && { name: data.name }),
  ...(data.calories && { calories: data.calories }),
  ...(data.category && { category: data.category }),
};    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.calories !== undefined) updateData.calories = data.calories;
    if (data.category !== undefined) updateData.category = data.category;
    
    console.log("Enviando para update:", { id, updateData });
    console.log("UPDATE DATA FINAL:", updateData);
try {
  const response = await api.put(`/meals/${id}`, updateData);
  return response.data;
} catch (error: any) {
  console.log("ERRO COMPLETO:", error.response?.data);
  throw error;
}
  },

  async delete(id: string) {
    const response = await api.delete(`/meals/${id}`);
    return response.data;
  }
};
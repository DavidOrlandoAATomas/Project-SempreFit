// frontend/src/services/exercise.service.ts
import { api } from "./api";
import { CreateExerciseDTO, UpdateExerciseDTO } from "../types/exercise";

export const ExerciseService = {

  async create(data: CreateExerciseDTO) {
    const response = await api.post("/exercises", data);
    return response.data.data || response.data;
  },

  async findAll() {
    const response = await api.get("/exercises");
    console.log("findAll - Resposta:", response.data);
    
    // Extrair os dados corretamente
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Se for array diretamente
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Se não encontrar, retornar array vazio
    console.warn("Estrutura inesperada:", response.data);
    return [];
  },

  async getStats() {
    const response = await api.get("/exercises/stats");
    return response.data.data || response.data;
  },

  async update(id: string, data: UpdateExerciseDTO) {
    const response = await api.put(`/exercises/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/exercises/${id}`);
    return response.data;
  }
};
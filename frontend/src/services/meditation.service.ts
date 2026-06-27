// frontend/src/services/meditation.service.ts
import { api } from "./api";
import { CreateMeditationDTO, UpdateMeditationDTO } from "../types/meditation";

export const MeditationService = {

  async create(data: CreateMeditationDTO) {
    const response = await api.post("/meditations", data);
    return response.data.data || response.data;
  },

  async findAll() {
    const response = await api.get("/meditations");
    console.log("🧘 findAll - Resposta:", response.data);
    
    // Extrair os dados corretamente
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  },

  async getStats() {
    const response = await api.get("/meditations/stats");
    return response.data.data || response.data;
  },

  async getWeeklyTrend() {
    const response = await api.get("/meditations/weekly-trend");
    return response.data.data || response.data;
  },

  async update(id: string, data: UpdateMeditationDTO) {
    const response = await api.put(`/meditations/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/meditations/${id}`);
    return response.data;
  }
};
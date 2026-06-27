// frontend/src/services/dashboard.service.ts
import { api } from "./api";
import { DashboardSummary } from "@/types/dashboard";



export const DashboardService = {

  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get("/dashboard/summary");
    
    
    
    console.log("DashboardService - Resposta completa:", response.data);
    
    if (response.data.success && response.data.data) {
      console.log("DashboardService - Dados extraídos:", response.data.data);
      return response.data.data;
    }
    
    return response.data;
  },

  async getWeeklyProgress() {
    const response = await api.get("/dashboard/weekly-progress");
    return response.data.data || response.data;
  },

  async getMonthlyReport(year: number, month: number) {
    const response = await api.get(`/dashboard/monthly-report?year=${year}&month=${month}`);
    return response.data.data || response.data;
  }
};
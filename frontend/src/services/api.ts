// frontend/src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://10.0.0.10:3002/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    
    console.log(" API Interceptor - Token encontrado:", token ? "Sim" : "Não");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Header Authorization adicionado");
    } else {
      console.warn("⚠️ Nenhum token encontrado no localStorage");
    }
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (refreshToken) {
          const response = await api.post("/auth/refresh", { refreshToken });
          
          if (response.data.success) {
            const newAccessToken = response.data.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Erro ao fazer refresh:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

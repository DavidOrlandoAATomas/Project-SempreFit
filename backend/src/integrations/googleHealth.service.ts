// backend/src/integrations/googleHealth.service.ts
import axios from "axios";
import prisma from "../config/prisma";

const GOOGLE_HEALTH_CLIENT_ID = process.env.GOOGLE_HEALTH_CLIENT_ID;
const GOOGLE_HEALTH_CLIENT_SECRET = process.env.GOOGLE_HEALTH_CLIENT_SECRET;
const GOOGLE_HEALTH_REDIRECT_URI = process.env.GOOGLE_HEALTH_REDIRECT_URI || "http://localhost:3001/api/integrations/google-health/callback";

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/fitness.nutrition.read",
  "https://www.googleapis.com/auth/cloud-platform"
];

export interface HealthDataPoint {
  startTime: string;
  endTime: string;
  value: number | string;
  unit?: string;
  dataType: string;
}

export interface HealthData {
  steps: number;
  calories: number;
  heartRate: number;
  sleepHours: number;
  weight?: number;
  date: string;
}

export class GoogleHealthService {
  
  /**
   * Obtém a URL de autorização OAuth 2.0 para a Google Health API
   */
  getAuthUrl(): string {
    if (!GOOGLE_HEALTH_CLIENT_ID || GOOGLE_HEALTH_CLIENT_ID === 'your_client_id.apps.googleusercontent.com') {
      throw new Error("GOOGLE_HEALTH_CLIENT_ID não configurada. Configure no arquivo .env");
    }

    console.log("🔑 Gerando URL de autenticação com escopos:", SCOPES);

    return `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_HEALTH_CLIENT_ID}` +
      `&redirect_uri=${GOOGLE_HEALTH_REDIRECT_URI}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(SCOPES.join(' '))}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&include_granted_scopes=true`;
  }

  /**
   * Troca o código de autorização por tokens de acesso
   */
  async exchangeCodeForToken(code: string): Promise<any> {
    try {
      if (!GOOGLE_HEALTH_CLIENT_ID || !GOOGLE_HEALTH_CLIENT_SECRET) {
        throw new Error("Google Health API credentials not configured");
      }

      console.log("🔐 Exchange code for token...");

      const response = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: GOOGLE_HEALTH_CLIENT_ID,
        client_secret: GOOGLE_HEALTH_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: GOOGLE_HEALTH_REDIRECT_URI
      });

      console.log("✅ Token obtido com sucesso");
      return response.data;
    } catch (error: any) {
      console.error("❌ Google Health token exchange error:", error.response?.data || error.message);
      throw new Error("Failed to exchange code for token");
    }
  }

  /**
   * Renova o token de acesso usando o refresh token
   */
  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: GOOGLE_HEALTH_CLIENT_ID,
        client_secret: GOOGLE_HEALTH_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      });

      return response.data;
    } catch (error) {
      console.error("Google Health refresh token error:", error);
      throw new Error("Failed to refresh token");
    }
  }

  /**
   * Sincroniza dados de saúde do Google Health API
   */
  async syncHealthData(userId: string, accessToken: string, startTime?: string, endTime?: string): Promise<HealthData[]> {
    try {
      const now = new Date();
      const startDate = startTime ? new Date(startTime) : new Date(now);
      startDate.setDate(startDate.getDate() - 7); // Últimos 7 dias por padrão
      
      const endDate = endTime ? new Date(endTime) : now;

      const startTimeMillis = startDate.getTime() * 1000 * 1000; // Nanosegundos
      const endTimeMillis = endDate.getTime() * 1000 * 1000;

      console.log(`📊 Sincronizando dados de saúde de ${startDate.toISOString()} até ${endDate.toISOString()}`);

      // Buscar dados agregados do Google Health
      const [stepsData, caloriesData, heartRateData, sleepData, weightData] = await Promise.all([
        this.getAggregatedData(accessToken, "com.google.step_count.delta", startTimeMillis, endTimeMillis),
        this.getAggregatedData(accessToken, "com.google.calories.expended", startTimeMillis, endTimeMillis),
        this.getAggregatedData(accessToken, "com.google.heart_rate.bpm", startTimeMillis, endTimeMillis),
        this.getAggregatedData(accessToken, "com.google.sleep.segment", startTimeMillis, endTimeMillis),
        this.getAggregatedData(accessToken, "com.google.weight", startTimeMillis, endTimeMillis)
      ]);

      // Processar e combinar dados
      const combinedData = this.combineHealthData(stepsData, caloriesData, heartRateData, sleepData, weightData);

      // Salvar no banco de dados
      await this.saveHealthData(userId, combinedData);

      return combinedData;
    } catch (error: any) {
      console.error("❌ Google Health sync error:", error.response?.data || error.message);
      throw new Error("Failed to sync health data");
    }
  }

  /**
   * Busca dados agregados de um data type específico
   */
  private async getAggregatedData(accessToken: string, dataType: string, startTimeMillis: number, endTimeMillis: number) {
    try {
      const response = await axios.post(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          aggregateBy: [{ dataTypeName: dataType }],
          bucketByTime: { durationMillis: 86400000 }, // 1 dia
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(`❌ Error fetching ${dataType}:`, error.response?.data || error.message);
      return { bucket: [] };
    }
  }

  /**
   * Combina dados de diferentes fontes em um único array
   */
  private combineHealthData(stepsData: any, caloriesData: any, heartRateData: any, sleepData: any, weightData: any): HealthData[] {
    const dailyMap = new Map<string, HealthData>();

    // Processar passos
    if (stepsData.bucket) {
      stepsData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        const steps = bucket.dataset[0]?.point?.[0]?.value?.[0]?.intVal || 0;
        
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { date, steps: 0, calories: 0, heartRate: 0, sleepHours: 0 });
        }
        dailyMap.get(date)!.steps = steps;
      });
    }

    // Processar calorias
    if (caloriesData.bucket) {
      caloriesData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        const calories = bucket.dataset[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
        
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { date, steps: 0, calories: 0, heartRate: 0, sleepHours: 0 });
        }
        dailyMap.get(date)!.calories = Math.round(calories);
      });
    }

    // Processar frequência cardíaca
    if (heartRateData.bucket) {
      heartRateData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        const heartRate = bucket.dataset[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
        
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { date, steps: 0, calories: 0, heartRate: 0, sleepHours: 0 });
        }
        dailyMap.get(date)!.heartRate = Math.round(heartRate);
      });
    }

    // Processar sono
    if (sleepData.bucket) {
      sleepData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        let sleepHours = 0;
        
        if (bucket.dataset[0]?.point) {
          bucket.dataset[0].point.forEach((point: any) => {
            // Duração do sono em nanosegundos -> horas
            const duration = point.value?.[0]?.intVal || 0;
            sleepHours += duration / (1000 * 1000 * 1000 * 60 * 60);
          });
        }
        
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { date, steps: 0, calories: 0, heartRate: 0, sleepHours: 0 });
        }
        dailyMap.get(date)!.sleepHours = Math.round(sleepHours * 10) / 10;
      });
    }

    // Processar peso
    if (weightData.bucket) {
      weightData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        const weight = bucket.dataset[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
        
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { date, steps: 0, calories: 0, heartRate: 0, sleepHours: 0 });
        }
        dailyMap.get(date)!.weight = Math.round(weight * 10) / 10;
      });
    }

    return Array.from(dailyMap.values());
  }

  /**
   * Salva os dados de saúde no banco de dados
   */
  private async saveHealthData(userId: string, data: HealthData[]) {
    try {
      console.log(`💾 Salvando ${data.length} dias de dados de saúde...`);

      for (const day of data) {
        // Se tiver atividade (passos ou calorias), criar um registro de exercício
        if (day.steps > 0 || day.calories > 0) {
          const activityName = day.steps > 0 ? `Google Health - ${day.steps} steps` : "Google Health - Activity";
          
          await prisma.exercise.create({
            data: {
              userId: userId,
              activity: activityName,
              duration: day.steps > 0 ? Math.round(day.steps / 100) : 0,
              caloriesBurned: day.calories || 0,
              createdAt: new Date(day.date)
            }
          });
        }

        // Se tiver dados de sono, criar um registro de meditação
        if (day.sleepHours > 0) {
          await prisma.meditation.create({
            data: {
              userId: userId,
              mood: day.sleepHours >= 7 ? 8 : 5,
              duration: Math.round(day.sleepHours * 60),
              notes: `Sono registrado pelo Google Health: ${day.sleepHours}h`,
              createdAt: new Date(day.date)
            }
          });
        }
      }

      console.log("✅ Dados de saúde salvos com sucesso");
    } catch (error) {
      console.error("❌ Error saving health data:", error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas resumidas do usuário
   */
  async getHealthStats(userId: string): Promise<any> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const exercises = await prisma.exercise.findMany({
        where: {
          userId: userId,
          createdAt: { gte: thirtyDaysAgo }
        }
      });

      const totalCalories = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
      const totalSteps = exercises
        .filter(e => e.activity.includes('steps'))
        .reduce((sum, e) => {
          const steps = parseInt(e.activity.match(/\d+/)?.[0] || '0');
          return sum + steps;
        }, 0);

      return {
        totalCalories: totalCalories,
        totalSteps: totalSteps,
        totalActivities: exercises.length,
        averageCalories: Math.round(totalCalories / (exercises.length || 1))
      };
    } catch (error) {
      console.error("Error getting health stats:", error);
      throw error;
    }
  }
}
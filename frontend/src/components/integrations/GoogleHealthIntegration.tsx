// frontend/src/components/integrations/GoogleHealthIntegration.tsx
"use client";

import { useState, useEffect } from "react";
import { IntegrationsService } from "@/services/integrations.service";
import { useToast } from "@/contexts/ToastContext";

export default function GoogleHealthIntegration() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Verificar se já está conectado
    const token = localStorage.getItem("google_health_token");
    if (token) {
      setConnected(true);
      loadStats();
    }
  }, []);

  const loadStats = async () => {
    try {
      const data = await IntegrationsService.getHealthStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      console.log("🔑 Obtendo URL de autenticação...");
      const authUrl = await IntegrationsService.getGoogleHealthAuthUrl();
      
      console.log("✅ URL obtida:", authUrl);
      
      // CORRIGIDO: Abrir em uma nova janela ou na mesma
      const width = 500;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        authUrl,
        "connect-google-health",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Verificar se a janela foi bloqueada
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Fallback: abrir na mesma janela
        window.location.href = authUrl;
      }
    } catch (error: any) {
      console.error("❌ Erro ao conectar:", error);
      showToast(error.message || "Erro ao conectar Google Health", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("google_health_token");
      
      if (!token) {
        showToast("Conecte-se ao Google Health primeiro", "info");
        return;
      }
      
      console.log("🔄 Sincronizando dados...");
      const data = await IntegrationsService.syncGoogleHealth(token);
      
      showToast(`Dados sincronizados com sucesso! (${data?.length || 0} dias)`, "success");
      await loadStats();
    } catch (error: any) {
      console.error("❌ Erro ao sincronizar:", error);
      showToast(error.message || "Erro ao sincronizar dados", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("google_health_token");
    localStorage.removeItem("google_health_refresh");
    setConnected(false);
    setStats(null);
    showToast("Desconectado do Google Health", "info");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">🏥 Google Health</h3>
        {connected && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            ✅ Conectado
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4">
        Sincronize seus dados de saúde do Google Health (passos, calorias, frequência cardíaca, sono)
      </p>

      {!connected ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Conectando..." : "🔗 Conectar Google Health"}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleSync}
              disabled={loading}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Sincronizando..." : "🔄 Sincronizar"}
            </button>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Desconectar
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Calorias</p>
                <p className="text-xl font-bold">{stats.totalCalories || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Passos</p>
                <p className="text-xl font-bold">{stats.totalSteps?.toLocaleString() || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Atividades</p>
                <p className="text-xl font-bold">{stats.totalActivities || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Média Calorias</p>
                <p className="text-xl font-bold">{stats.averageCalories || 0}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
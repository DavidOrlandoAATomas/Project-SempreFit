// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { DashboardService } from "@/services/dashboard.service";
import { DashboardSummary } from "@/types/dashboard";
import StatCard from "@/components/ui/StatCard";

export default function Dashboard() {
  
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  const safe = summary ?? {
    calories: { consumed: 0, burned: 0, balance: 0, weeklyAverageConsumed: 0, weeklyAverageBurned: 0 },
    exercises: { total: 0, totalDuration: 0, totalCalories: 0 },
    meals: { total: 0, totalCalories: 0 },
    meditation: { total: 0, avgMood: 0, totalMinutes: 0 },
    streak: { current: 0, longest: 0 },
    imc: 0,
    weight: 0,
    goal: null,
    date: "",
    total: {
      meals: 0,
      caloriesIn: 0,
      exercises: 0,
      caloriesOut: 0,
      meditations: 0,
      meditationMinutes: 0,
      averageMood: 0
    }
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await DashboardService.getSummary();
        console.log("📊 Dashboard - Dados recebidos:", data);

        if (mounted) {
          setSummary(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Carregando dashboard...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Resumo do dia {safe.date} {safe.goal ? `- Objetivo: ${safe.goal.replace('_', ' ')}` : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="IMC" value={safe.imc?.toFixed(2) || "N/A"} />
          <StatCard title="Peso" value={`${safe.weight || 0} kg`} />
          <StatCard title="Calorias Hoje" value={`${safe.calories.consumed} / ${safe.calories.burned}`} />
          <StatCard title="Streak" value={`${safe.streak.current} dias`} />
        </div>

        <h2 className="text-xl font-semibold mb-4">📊 Hoje</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Refeições" value={safe.meals.total} />
          <StatCard title="Exercícios" value={safe.exercises.total} />
          <StatCard title="Meditações" value={safe.meditation.total} />
        </div>

        <h2 className="text-xl font-semibold mb-4">📈 Totais Acumulados</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Refeições" value={safe.total.meals} />
          <StatCard title="Total Calorias" value={safe.total.caloriesIn} />
          <StatCard title="Total Exercícios" value={safe.total.exercises} />
          <StatCard title="Total Meditações" value={safe.total.meditations} />
        </div>

        <h2 className="text-xl font-semibold mb-4">📈 Métricas Adicionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Média Humor (Total)" value={safe.total.averageMood || 0} />
          <StatCard title="Tempo Meditação" value={`${safe.total.meditationMinutes || 0} min`} />
          <StatCard title="Calorias Queimadas" value={safe.total.caloriesOut || 0} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">📊 Calorias (Semana)</h2>
            <div className="text-sm text-gray-600">
              <div>Consumidas: {safe.calories.weeklyAverageConsumed}</div>
              <div>Queimadas: {safe.calories.weeklyAverageBurned}</div>
              <div>Saldo: {safe.calories.weeklyAverageBurned - safe.calories.weeklyAverageConsumed}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">🏆 Progresso</h2>
            <div className="text-sm text-gray-600">
              <div>Melhor Streak: {safe.streak.longest} dias</div>
              <div>Total Refeições: {safe.total.meals}</div>
              <div>Total Exercícios: {safe.total.exercises}</div>
              <div>Total Meditações: {safe.total.meditations}</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
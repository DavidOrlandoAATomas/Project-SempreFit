// frontend/src/app/meals/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { Meal } from "@/types/meal";
import { MealService } from "@/services/meal.service";
import { useToast } from "@/contexts/ToastContext";
import { useModal } from "@/contexts/ModalContext";
import MealForm from "@/components/forms/MealForm";


export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();

  const filtered = meals.filter((m) => {
    if (!m || !m.name) return false;
    return m.name.toLowerCase().includes(search.toLowerCase());
  });

  const loadMeals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await MealService.findAll();
      console.log("Dados carregados:", data);
      const validMeals = Array.isArray(data) 
        ? data.filter(meal => meal && meal.name) 
        : [];
      setMeals(validMeals);
    } catch (error) {
      console.error("Erro meals:", error);
      showToast("Erro ao carregar refeições", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const handleCreate = useCallback(() => {
    openModal({
      title: "Nova Refeição",
      content: (
        <MealForm
          onSubmit={async (data) => {
            try {
              const meal = await MealService.create(data);
              setMeals(prev => [...prev, meal]);
              showToast("Refeição criada com sucesso", "success");
              closeModal();
            } catch (error) {
              console.error("Erro ao criar:", error);
              showToast("Erro ao criar refeição", "error");
            }
          }}
        />
      )
    });
  }, [openModal, closeModal, showToast]);

  const handleEdit = useCallback((meal: Meal) => {
    openModal({
      title: "Editar Refeição",
      content: (
        <MealForm
          initialData={{
            name: meal.name,
            calories: meal.calories,
            category: meal.category,
          }}
          onSubmit={async (data) => {
            try {
              const updated = await MealService.update(meal.id, data);
              // Atualizar o estado imediatamente
              setMeals(prev => prev.map(m => 
                m.id === meal.id ? { ...m, ...updated } : m
              ));
              showToast("Refeição atualizada com sucesso", "success");
              closeModal();
            } catch (error) {
              console.error("Erro ao atualizar:", error);
              showToast("Erro ao atualizar refeição", "error");
            }
          }}
        />
      )
    });
  }, [openModal, closeModal, showToast]);

  const handleDelete = useCallback((id: string) => {
    openModal({
      title: "Confirmar exclusão",
      content: <p>Esta ação remove a refeição permanentemente.</p>,
      onConfirm: async () => {
        try {
          await MealService.delete(id);
          setMeals((prev) => prev.filter((m) => m.id !== id));
          showToast("Refeição removida com sucesso", "success");
        } catch (error) {
          console.error("Erro ao deletar:", error);
          showToast("Erro ao remover refeição", "error");
        }
      }
    });
  }, [openModal, showToast]);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      BREAKFAST: "Café da Manhã",
      LUNCH: "Almoço",
      DINNER: "Jantar",
      SNACK: "Lanche",
      DESSERT: "Sobremesa",
      BEVERAGE: "Bebida"
    };
    return labels[category] || category;
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Refeições</h1>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            + Nova Refeição
          </button>
        </div>

        <input
          className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="🔍 Pesquisar refeições..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="text-center py-8 text-gray-500">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {search ? "Nenhuma refeição encontrada para esta busca." : "Nenhuma refeição cadastrada. Clique em 'Nova Refeição' para começar."}
          </p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Calorias</th>
                  <th className="p-4 text-left">Categoria</th>
                  <th className="p-4 text-left">Data</th>
                  <th className="p-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((meal) => (
                  <tr key={meal.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{meal.name}</td>
                    <td className="p-4">{meal.calories} kcal</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {getCategoryLabel(meal.category)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {meal.createdAt
                        ? new Date(meal.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(meal)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(meal.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
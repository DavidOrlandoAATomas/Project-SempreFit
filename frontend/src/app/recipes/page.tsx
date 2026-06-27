// frontend/src/app/recipes/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { IntegrationsService, Recipe } from "@/services/integrations.service";
import { useToast } from "@/contexts/ToastContext";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [calories, setCalories] = useState(500);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { showToast } = useToast();

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const data = await IntegrationsService.suggestRecipes(calories);
      setRecipes(data);
      if (data.length === 0) {
        showToast("Nenhuma receita encontrada para essas calorias", "info");
      }
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
      showToast("Erro ao carregar receitas", "error");
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async () => {
    if (!searchQuery.trim()) {
      showToast("Digite um termo para pesquisar", "info");
      return;
    }
    
    try {
      setLoading(true);
      const data = await IntegrationsService.searchRecipes(searchQuery);
      setRecipes(data);
      if (data.length === 0) {
        showToast("Nenhuma receita encontrada", "info");
      }
    } catch (error) {
      console.error("Erro ao pesquisar:", error);
      showToast("Erro ao pesquisar receitas", "error");
    } finally {
      setLoading(false);
    }
  };

  const viewRecipe = async (id: number) => {
    try {
      const recipe = await IntegrationsService.getRecipeById(id);
      setSelectedRecipe(recipe);
    } catch (error) {
      console.error("Erro ao carregar receita:", error);
      showToast("Erro ao carregar detalhes da receita", "error");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-6">🍳 Receitas</h1>

        {/* Buscador */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Pesquisar receitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && searchRecipes()}
            />
            <button
              onClick={searchRecipes}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Pesquisar
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <label className="text-sm font-medium">Calorias máximas:</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-24 border p-2 rounded"
              min="100"
              max="2000"
            />
            <button
              onClick={loadSuggestions}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Sugerir Receitas
            </button>
          </div>
        </div>

        {/* Lista de Receitas */}
        {loading ? (
          <p className="text-center py-8">Carregando receitas...</p>
        ) : recipes.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            Nenhuma receita encontrada. Pesquise ou peça sugestões!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => viewRecipe(recipe.id)}
              >
                {recipe.image && (
                  <div className="relative w-full h-48">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>⏱️ {recipe.readyInMinutes} min</span>
                    <span>🍽️ {recipe.servings} porções</span>
                  </div>
                  {recipe.nutrition && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">
                        Calorias: {recipe.nutrition.nutrients.find(n => n.name === "Calories")?.amount || 0} kcal
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal da Receita */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedRecipe.title}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {selectedRecipe.image && (
                <div className="relative w-full h-64 mb-4">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span>⏱️ {selectedRecipe.readyInMinutes} min</span>
                <span>🍽️ {selectedRecipe.servings} porções</span>
                {selectedRecipe.nutrition && (
                  <span>
                    🔥 {selectedRecipe.nutrition.nutrients.find(n => n.name === "Calories")?.amount || 0} kcal
                  </span>
                )}
              </div>
              
              <div
                className="prose prose-sm max-w-none mb-4"
                dangerouslySetInnerHTML={{ __html: selectedRecipe.summary || "" }}
              />
              
              {selectedRecipe.sourceUrl && (
                <a
                  href={selectedRecipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ver receita completa
                </a>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
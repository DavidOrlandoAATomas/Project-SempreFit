// frontend/src/app/exercises/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { Exercise } from "@/types/exercise";
import { ExerciseService } from "@/services/exercise.service";
import { useToast } from "@/contexts/ToastContext";
import { useModal } from "@/contexts/ModalContext";
import ExerciseForm from "@/components/forms/ExerciseForm";


export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();

  const filtered = exercises.filter((e) =>
    e.activity.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await ExerciseService.findAll();
        if (!controller.signal.aborted) {
          setExercises(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erro exercises:", error);
        showToast("Erro ao carregar exercícios", "error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [showToast]);

  const handleCreate = useCallback(() => {
    openModal({
  title: "Novo Exercício",

  content: (
    <ExerciseForm
      onSubmit={async (data) => {

        const created =
          await ExerciseService.create(
            data
          );

        setExercises(prev => [
          ...prev,
          created
        ]);

        showToast(
          "Exercício criado",
          "success"
        );
        closeModal();
      }}
    />
  )
});
  }, [openModal, showToast, closeModal]);

  const handleEdit = useCallback((exercise: Exercise) => {
    openModal({
  title: "Editar Exercício",

  content: (
    <ExerciseForm
      initialData={{
        activity: exercise.activity,
        duration: exercise.duration,
        caloriesBurned:
          exercise.caloriesBurned,
      }}
      onSubmit={async (data) => {

        const updated =
          await ExerciseService.update(
            exercise.id,
            data
          );

        setExercises(prev =>
          prev.map(e =>
            e.id === exercise.id
              ? updated
              : e
          )
        );

        showToast(
          "Exercício atualizado",
          "success"
        );
        closeModal();
      }}
    />
  )
});
  }, [openModal, showToast, closeModal]);

  const handleDelete = useCallback((id: string) => {
    openModal({
      title: "Confirmar exclusão",
      content: <p>Esta ação remove o exercício permanentemente.</p>,
      onConfirm: async () => {
        try {
          await ExerciseService.delete(id);
          setExercises((prev) => prev.filter((e) => e.id !== id));
          showToast("Exercício removido com sucesso", "success");
          closeModal();
        } catch (error) {
          console.error("Erro ao deletar:", error);
          showToast("Erro ao remover exercício", "error");
        }
      }
    });
  }, [openModal, showToast, closeModal]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Exercícios</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            + Novo Exercício
          </button>
        </div>

        <input
          className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="🔍 Pesquisar exercícios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="text-center py-8 text-gray-500">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {search ? "Nenhum exercício encontrado para esta busca." : "Nenhum exercício cadastrado. Clique em 'Novo Exercício' para começar."}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((exercise) => (
              <div key={exercise.id} className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-2">{exercise.activity}</h3>
                <p className="text-gray-600">⏱️ Duração: {exercise.duration} min</p>
                <p className="text-gray-600">🔥 Calorias: {exercise.caloriesBurned}</p>
                <div className="flex gap-3 mt-4 pt-2 border-t">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
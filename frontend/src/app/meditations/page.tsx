// frontend/src/app/meditations/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { Meditation } from "@/types/meditation";
import { MeditationService } from "@/services/meditation.service";
import { useToast } from "@/contexts/ToastContext";
import { useModal } from "@/contexts/ModalContext";
import MeditationForm from "@/components/forms/MeditationForm";

export default function MeditationsPage() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();

  const filtered = meditations.filter((m) =>
    (m.notes ?? "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await MeditationService.findAll();
        if (!controller.signal.aborted) {
          setMeditations(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erro meditations:", error);
        showToast("Erro ao carregar meditações", "error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [showToast]);

  const handleCreate = useCallback(() => {
openModal({
  title: "Nova Meditação",

  content: (
    <MeditationForm
      onSubmit={async (data) => {

        const meditation =
          await MeditationService.create(
            data
          );

        setMeditations(prev => [
          ...prev,
          meditation
        ]);

        showToast(
          "Meditação criada",
          "success"
        );
        closeModal();
      }}
    />
  )
});
  }, [openModal, showToast, closeModal]);

  const handleEdit = useCallback((meditation: Meditation) => {
openModal({
  title: "Editar Meditação",

  content: (
    <MeditationForm
      initialData={{
        mood: meditation.mood,
        duration: meditation.duration,
        notes:
          meditation.notes ?? "",
      }}
      onSubmit={async (data) => {

        const updated =
          await MeditationService.update(
            meditation.id,
            data
          );

        setMeditations(prev =>
          prev.map(m =>
            m.id === meditation.id
              ? updated
              : m
          )
        );
        showToast("Meditação actualizada", "success");
        closeModal();
      }}
    />
  )
});
  }, [openModal,showToast, closeModal]);

  const handleDelete = useCallback((id: string) => {
    openModal({
      title: "Confirmar exclusão",
      content: <p>Esta ação remove a meditação permanentemente.</p>,
      onConfirm: async () => {
        try {
          await MeditationService.delete(id);
          setMeditations((prev) => prev.filter((m) => m.id !== id));
          showToast("Meditação removida com sucesso", "success");
          closeModal();
        } catch (error) {
          console.error("Erro ao deletar:", error);
          showToast("Erro ao remover meditação", "error");
        }
      }

    });
  }, [openModal, showToast, closeModal]);

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😫";
    if (mood <= 4) return "😐";
    if (mood <= 6) return "🙂";
    if (mood <= 8) return "😊";
    return "🤩";
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Meditações</h1>
          <button
            onClick={handleCreate}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            + Nova Meditação
          </button>
        </div>

        <input
          className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="🔍 Pesquisar meditações por notas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="text-center py-8 text-gray-500">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {search ? "Nenhuma meditação encontrada para esta busca." : "Nenhuma meditação cadastrada. Clique em 'Nova Meditação' para começar."}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{getMoodEmoji(item.mood)}</span>
                    <span className="font-bold text-lg">{item.mood}/10</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600">⏱️ Duração: {item.duration} minutos</p>
                
                {item.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-gray-600 text-sm italic">&quot;{item.notes}&quot;</p>
                  </div>
                )}
                
                <p className="text-gray-400 text-xs mt-3">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
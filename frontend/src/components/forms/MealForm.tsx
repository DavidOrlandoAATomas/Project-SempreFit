// frontend/src/components/forms/MealForm.tsx
"use client";

import { useState, useCallback } from "react";

interface MealFormData {
  name: string;
  calories: number;
  category: string;
}

interface MealFormProps {
  initialData?: MealFormData;
  onSubmit: (data: MealFormData) => Promise<void>;
}

export default function MealForm({ initialData, onSubmit }: MealFormProps) {
  const [form, setForm] = useState<MealFormData>({
    name: initialData?.name || "",
    calories: initialData?.calories || 0,
    category: initialData?.category || ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert("Nome da refeição é obrigatório");
      return;
    }
    
    if (form.calories <= 0) {
      alert("Calorias devem ser maiores que zero");
      return;
    }
    
    if (!form.category) {
      alert("Selecione uma categoria");
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }, [form, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nome da Refeição *</label>
        <input
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex: Salada de Frutas"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Calorias *</label>
        <input
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          type="number"
          min="1"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })}
          placeholder="300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoria *</label>
        <select
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Selecione uma categoria</option>
          <option value="BREAKFAST">Café da Manhã</option>
          <option value="LUNCH">Almoço</option>
          <option value="DINNER">Jantar</option>
          <option value="SNACK">Lanche</option>
          <option value="DESSERT">Sobremesa</option>
          <option value="BEVERAGE">Bebida</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full transition-colors disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
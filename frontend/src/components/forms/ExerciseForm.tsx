"use client";

import { useState } from "react";

export interface ExerciseFormData {
  activity: string;
  duration: number;
  caloriesBurned: number;
}

interface ExerciseFormProps {
  initialData?: ExerciseFormData;
  onSubmit: (
    data: ExerciseFormData
  ) => Promise<void>;
}

export default function ExerciseForm({
  initialData,
  onSubmit,
}: ExerciseFormProps) {

  const [form, setForm] =
    useState<ExerciseFormData>(
      initialData ?? {
        activity: "",
        duration: 0,
        caloriesBurned: 0,
      }
    );

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(form);
      }}
    >
      <input
        className="w-full border p-3 rounded"
        placeholder="Atividade"
        value={form.activity}
        onChange={(e) =>
          setForm({
            ...form,
            activity: e.target.value,
          })
        }
      />

      <input
        type="number"
        className="w-full border p-3 rounded"
        placeholder="Duração (min)"
        value={form.duration}
        onChange={(e) =>
          setForm({
            ...form,
            duration: Number(e.target.value),
          })
        }
      />

      <input
        type="number"
        className="w-full border p-3 rounded"
        placeholder="Calorias queimadas"
        value={form.caloriesBurned}
        onChange={(e) =>
          setForm({
            ...form,
            caloriesBurned:
              Number(e.target.value),
          })
        }
      />

      <button
        type="submit"
        className="
          w-full
          bg-blue-600
          text-white
          p-3
          rounded
        "
      >
        Salvar
      </button>
    </form>
  );
}
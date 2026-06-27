"use client";

import { useState } from "react";

export interface MeditationFormData {
  mood: number;
  duration: number;
  notes: string;
}

interface MeditationFormProps {
  initialData?: MeditationFormData;
  onSubmit: (
    data: MeditationFormData
  ) => Promise<void>;
}

export default function MeditationForm({
  initialData,
  onSubmit,
}: MeditationFormProps) {
  const [form, setForm] =
    useState<MeditationFormData>(
      initialData ?? {
        mood: 5,
        duration: 0,
        notes: "",
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
      <div>
        <label className="block mb-1">
          Humor (1 a 10)
        </label>

        <input
          type="number"
          min={1}
          max={10}
          className="w-full border p-3 rounded"
          value={form.mood}
          onChange={(e) =>
            setForm({
              ...form,
              mood: Number(e.target.value),
            })
          }
        />
      </div>

      <div>
        <label className="block mb-1">
          Duração (min)
        </label>

        <input
          type="number"
          className="w-full border p-3 rounded"
          value={form.duration}
          onChange={(e) =>
            setForm({
              ...form,
              duration: Number(e.target.value),
            })
          }
        />
      </div>

      <div>
        <label className="block mb-1">
          Observações
        </label>

        <textarea
          rows={4}
          className="w-full border p-3 rounded"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
        />
      </div>

      <button
        type="submit"
        className="
          w-full
          bg-purple-600
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
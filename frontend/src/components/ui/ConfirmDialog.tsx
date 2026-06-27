// src/components/ui/ConfirmDialog.tsx
"use client";

interface Props {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
            Cancelar
          </button>

          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
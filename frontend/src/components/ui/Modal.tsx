"use client";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  children,
  onClose
}: ModalProps) {

  if (!open) return null;

  return (
    <div
      className="
      fixed inset-0
      bg-black/50
      flex items-center
      justify-center
      z-50"
    >
      <div
        className="
        bg-white
        rounded-xl
        w-full
        max-w-lg
        p-6"
      >
        <div className="flex justify-between mb-4">

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        {children}

      </div>
    </div>
  );
}
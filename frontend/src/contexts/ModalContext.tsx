// frontend/src/contexts/ModalContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from "react";

interface ModalOptions {
  title: string;
  content: ReactNode;
  onConfirm?: () => void | Promise<void>;
}

interface ModalContextData {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextData | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const openModal = useCallback((opts: ModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    setLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (options?.onConfirm) {
      setLoading(true);
      try {
        await options.onConfirm();
      } finally {
        setLoading(false);
      }
    }
    closeModal();
  }, [options, closeModal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">{options.title}</h2>
            
            <div className="mb-4">
              {options.content}
            </div>
            
            {options.onConfirm && (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Confirmar"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
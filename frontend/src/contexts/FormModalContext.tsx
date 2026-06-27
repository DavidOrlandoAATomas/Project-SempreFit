// frontend/src/contexts/FormModalContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback
} from "react";

// Tipos base para formulários
export type DefaultValues = Record<string, unknown>;

interface FormModalOptions<T extends DefaultValues = DefaultValues> {
  title: string;
  defaultValues?: T;
  mode?: "create" | "edit";
  initialData?: T;
  onSubmit: (data: T) => Promise<void> | void;
  renderForm: (props: {
    defaultValues: T;
    onSubmit: (data: T) => void;
  }) => React.ReactNode;
}

interface FormModalContextData {
  openFormModal: <T extends DefaultValues>(options: FormModalOptions<T>) => void;
  closeFormModal: () => void;
}

const FormModalContext = createContext<FormModalContextData | undefined>(undefined);

export function FormModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<FormModalOptions | null>(null);

  const openFormModal = useCallback(<T extends DefaultValues>(opts: FormModalOptions<T>) => {
    setOptions(opts as FormModalOptions);
    setOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setOpen(false);
    setOptions(null);
  }, []);

  const getDefaultValues = useCallback(() => {
    if (options?.defaultValues) {
      return options.defaultValues;
    }
    if (options?.initialData) {
      return options.initialData;
    }
    return {};
  }, [options]);

  const handleSubmit = useCallback((data: DefaultValues) => {
    if (options?.onSubmit) {
      options.onSubmit(data);
    }
    closeFormModal();
  }, [options, closeFormModal]);

  if (!open || !options) {
    return <>{children}</>;
  }

  return (
    <FormModalContext.Provider value={{ openFormModal, closeFormModal }}>
      {children}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">{options.title}</h2>
          
          {options.renderForm({
            defaultValues: getDefaultValues(),
            onSubmit: handleSubmit
          })}
          
          <button
            onClick={closeFormModal}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full"
          >
            Cancelar
          </button>
        </div>
      </div>
    </FormModalContext.Provider>
  );
}

export function useFormModal() {
  const context = useContext(FormModalContext);
  if (!context) {
    throw new Error("useFormModal must be used within a FormModalProvider");
  }
  return context;
}
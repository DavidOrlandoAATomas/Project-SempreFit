// frontend/src/app/integrations/google-health/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

export default function GoogleHealthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken) {
      // Salvar tokens
      localStorage.setItem("google_health_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("google_health_refresh", refreshToken);
      }

      showToast("Google Health conectado com sucesso!", "success");

      // Redirecionar para a página de integrações
      setTimeout(() => {
        router.push("/integrations");
      }, 1000);
    } else {
      showToast("Erro ao conectar Google Health", "error");
      router.push("/integrations");
    }
  }, [searchParams, router, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Conectando ao Google Health...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Aguarde, estamos finalizando a conexão.</p>
      </div>
    </div>
  );
}
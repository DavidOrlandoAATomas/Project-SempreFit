// frontend/src/app/integrations/page.tsx
"use client";

import ProtectedRoute from "@/middleware/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import GoogleHealthIntegration from "@/components/integrations/GoogleHealthIntegration";

export default function IntegrationsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-6">🔌 Integrações</h1>
        <p className="text-black-500 mb-6">
          Conecte suas contas para sincronizar dados automaticamente
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoogleHealthIntegration />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
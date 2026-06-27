// frontend/src/app/profile/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { UserService } from "@/services/user.service";
import { useToast } from "@/contexts/ToastContext";

interface ProfileData {
  name: string;
  email: string;
  height?: number;
  weight?: number;
  birthDate?: string;
  gender?: string;
  goal?: string;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: ""
  });
  const [passwords, setPasswords] = useState<PasswordData>({
    oldPassword: "",
    newPassword: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { showToast } = useToast();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UserService.getProfile();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        height: data.height,
        weight: data.weight,
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : undefined,
        gender: data.gender,
        goal: data.goal
      });
    } catch {
      showToast("Erro ao carregar perfil", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(async () => {
    try {
      setUpdating(true);
      const payload = {
  ...profile,
  birthDate: profile.birthDate
    ? new Date(profile.birthDate).toISOString()
    : undefined
};

await UserService.updateProfile(payload);
      showToast("Perfil atualizado com sucesso", "success");
    } catch {
      showToast("Erro ao atualizar perfil", "error");
    } finally {
      setUpdating(false);
    }
  }, [profile, showToast]);

  const changePassword = useCallback(async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      showToast("Preencha ambos os campos de senha", "error");
      return;
    }

    if (passwords.newPassword.length < 6) {
      showToast("A nova senha deve ter pelo menos 6 caracteres", "error");
      return;
    }

    try {
      setChangingPassword(true);
      await UserService.changePassword(passwords);
      showToast("Senha alterada com sucesso", "success");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch {
      showToast("Erro ao alterar senha", "error");
    } finally {
      setChangingPassword(false);
    }
  }, [passwords, showToast]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Carregando perfil...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="seu@email.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Altura (cm)</label>
              <input
                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                value={profile.height || ""}
                onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                placeholder="175"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Peso (kg)</label>
              <input
                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                value={profile.weight || ""}
                onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                placeholder="70"
              />
            </div>
          </div>

          <button
            onClick={updateProfile}
            disabled={updating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {updating ? "Atualizando..." : "Atualizar Perfil"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mt-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Senha Atual</label>
            <input
              type="password"
              placeholder="Digite sua senha atual"
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nova Senha</label>
            <input
              type="password"
              placeholder="Digite a nova senha (mínimo 6 caracteres)"
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
          </div>

          <button
            onClick={changePassword}
            disabled={changingPassword}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {changingPassword ? "Alterando..." : "Alterar Senha"}
          </button>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
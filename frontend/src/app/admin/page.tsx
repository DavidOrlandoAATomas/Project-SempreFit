// frontend/src/app/admin/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { UserService } from "@/services/user.service";
import { useToast } from "@/contexts/ToastContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface AdminStats {
  users: number;
  admins: number;
  meals: number;
  exercises: number;
  meditations: number;
  avgCalories: number;
  avgCaloriesBurned: number;
  avgMood: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        UserService.getAllUsers(),
        UserService.getAdminStats()
      ]);
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showToast("Erro ao carregar dados do admin", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const promoteUser = useCallback(async (id: string) => {
    setActionLoading(id);
    try {
      const updatedUser = await UserService.promoteUser(id);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      showToast("Usuário promovido a ADMIN com sucesso", "success");
    } catch (error) {
      console.error("Erro ao promover:", error);
      showToast("Erro ao promover usuário", "error");
    } finally {
      setActionLoading(null);
    }
  }, [showToast]);

  const demoteUser = useCallback(async (id: string) => {
    setActionLoading(id);
    try {
      const updatedUser = await UserService.demoteUser(id);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      showToast("Usuário rebaixado para USER com sucesso", "success");
    } catch (error) {
      console.error("Erro ao rebaixar:", error);
      showToast("Erro ao rebaixar usuário", "error");
    } finally {
      setActionLoading(null);
    }
  }, [showToast]);

  const removeUser = useCallback(async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;
    
    setActionLoading(id);
    try {
      await UserService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast("Usuário removido com sucesso", "success");
      // Recarregar estatísticas
      const newStats = await UserService.getAdminStats();
      setStats(newStats);
    } catch (error) {
      console.error("Erro ao remover:", error);
      showToast("Erro ao remover usuário", "error");
    } finally {
      setActionLoading(null);
    }
  }, [showToast]);

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-6">Administração</h1>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Usuários</p>
            <p className="text-2xl font-bold">{stats?.users || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Administradores</p>
            <p className="text-2xl font-bold">{stats?.admins || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Refeições</p>
            <p className="text-2xl font-bold">{stats?.meals || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Média Calorias</p>
            <p className="text-2xl font-bold">{stats?.avgCalories || 0}</p>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum usuário cadastrado.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Tipo</th>
                  <th className="p-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "ADMIN" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {user.role === "ADMIN" ? "Administrador" : "Utilizador"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() => promoteUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                          >
                            {actionLoading === user.id ? "..." : "Tornar Admin"}
                          </button>
                        )}
                        {user.role === "ADMIN" && (
                          <button
                            onClick={() => demoteUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium disabled:opacity-50"
                          >
                            {actionLoading === user.id ? "..." : "Remover Admin"}
                          </button>
                        )}
                        <button
                          onClick={() => removeUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
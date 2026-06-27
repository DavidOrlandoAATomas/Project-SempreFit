// frontend/src/components/layouts/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  Brain,
  User,
  Shield,
  Plug
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">SempreFit</h1>

      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            isActive("/dashboard") ? "bg-green-600" : "hover:bg-slate-800"
          }`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/meals"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            isActive("/meals") ? "bg-green-600" : "hover:bg-slate-800"
          }`}
        >
          <Utensils size={18} />
          Refeições
        </Link>

        <Link
          href="/exercises"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            isActive("/exercises") ? "bg-green-600" : "hover:bg-slate-800"
          }`}
        >
          <Dumbbell size={18} />
          Exercícios
        </Link>

        <Link
          href="/meditations"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            isActive("/meditations") ? "bg-green-600" : "hover:bg-slate-800"
          }`}
        >
          <Brain size={18} />
          Meditações
        </Link>

        <Link
          href="/recipes"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            isActive("/recipes") ? "bg-orange-600" : "hover:bg-slate-800"
          }`}
        >
          <span>🍳</span>
          Receitas
        </Link>

        {/* ✅ LINK DE INTEGRAÇÕES ADICIONADO AQUI */}
        <Link
          href="/integrations"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            isActive("/integrations") ? "bg-purple-600" : "hover:bg-slate-800"
          }`}
        >
          <Plug size={18} />
          Integrações
        </Link>

        <Link
          href="/profile"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            isActive("/profile") ? "bg-green-600" : "hover:bg-slate-800"
          }`}
        >
          <User size={18} />
          Perfil
        </Link>

        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
              isActive("/admin") ? "bg-purple-600" : "hover:bg-slate-800"
            }`}
          >
            <Shield size={18} />
            Administração
          </Link>
        )}

        <button
          onClick={logout}
          className="mt-4 text-left px-4 py-3 rounded-lg hover:bg-red-600 transition text-red-400 hover:text-white"
        >
          Sair
        </button>
      </nav>
    </aside>
  );
}
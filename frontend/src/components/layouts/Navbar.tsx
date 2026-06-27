// frontend/src/components/layouts/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  
  useEffect(() => {
    setMounted(true);
    // Carregar email do usuário apenas no cliente
    if (user?.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Renderizar um placeholder durante a hidratação
  if (!mounted) {
    return (
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">SempreFit</h1>
        <div className="flex items-center gap-4">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
          <button className="text-red-600 hover:text-red-800">Sair</button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">SempreFit</h1>
      
      <div className="flex items-center gap-4">
        <span className="text-gray-600">
          {userEmail || "Carregando..."}
        </span>
        
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
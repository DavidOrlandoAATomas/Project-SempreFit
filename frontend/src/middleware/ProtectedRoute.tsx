// frontend/src/middleware/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "USER";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!token) {
        console.log("🔒 ProtectedRoute - No token, redirecting to login");
        router.push("/login");
        return;
      }

      if (requiredRole === "ADMIN" && user?.role !== "ADMIN") {
        console.log(" ProtectedRoute - Admin access required");
        router.push("/dashboard");
        return;
      }

      setAuthorized(true);
    }
  }, [token, user, loading, router, requiredRole]);

  if (loading || !authorized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Verificando acesso...</div>
      </div>
    );
  }

  return <>{children}</>;
}
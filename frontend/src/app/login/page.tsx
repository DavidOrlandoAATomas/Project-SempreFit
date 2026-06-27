"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface ErrorResponse {
  error?: string;
  success?: boolean;
}


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();


  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const response = await AuthService.login({ email, password });

      if (response.data.success) {

  const accessToken =
    response.data.data.accessToken;

  const refreshToken =
    response.data.data.refreshToken;

  const user =
    response.data.data.user;

  localStorage.setItem(
    "refreshToken",
    refreshToken
  );

  login(
    accessToken,
    user
  );

  router.push("/dashboard");

      } else {
        setError(response.data.error || "Login failed");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.error || "An error occurred");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center mt-4"> Não possui conta
            <Link href="/register" className="text-blue-600"> Registar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
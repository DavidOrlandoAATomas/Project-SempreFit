"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import Link from "next/link";
import { RegisterDTO } from "@/types/auth";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterDTO>({
    name: "",
    email: "",
    password: "",
    height: 170,
    weight: 70,
    birthDate: "",
    gender: "MALE",
    goal: "MAINTENANCE"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(email);
    setEmailValid(valid ? true : false);
    return valid;
  };

  async function handleRegister() {
    setLoading(true);
    setError("");

    try {
      if (!validateEmail(form.email)) {
        setError("Por favor, insira um email válido.");
        setLoading(false);
        return;
      }

      const dataToSend = {
        ...form,
        birthDate: form.birthDate ? new Date(form.birthDate).toISOString() : new Date().toISOString()
      };

      await AuthService.register(dataToSend);
      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
      
    } catch (error: any) {
      console.error("Erro no registro:", error);
      
      if (error.response?.status === 409) {
        setError("Este email já está cadastrado. Faça login ou use outro email.");
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.error || "Verifique seus dados e tente novamente.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Criar Conta</h1>

        {success ? (
          <div className="text-center p-4 bg-green-100 text-green-700 rounded-lg">
            <p className="text-2xl mb-2">Conta criada!</p>
            <p className="mb-4">Enviamos um email de boas-vindas para você.</p>
            <p className="text-sm text-gray-500">Redirecionando para o login...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <input
                className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nome *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <div>
                <input
                  className={`w-full border p-3 rounded focus:outline-none focus:ring-2 ${
                    emailValid === true ? "border-green-500 focus:ring-green-500" :
                    emailValid === false ? "border-red-500 focus:ring-red-500" :
                    "border-gray-300 focus:ring-green-500"
                  }`}
                  placeholder="Email *"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    validateEmail(e.target.value);
                  }}
                  required
                />
                {emailValid === true && (
                  <p className="text-green-500 text-xs mt-1">Email válido</p>
                )}
                {emailValid === false && (
                  <p className="text-red-500 text-xs mt-1">Email inválido</p>
                )}
              </div>

              <input
                type="password"
                className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Senha * (mínimo 6 caracteres)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Altura (cm)"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
                />

                <input
                  type="number"
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Peso (kg)"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as RegisterDTO["gender"] })}
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                </select>

                <select
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value as RegisterDTO["goal"] })}
                >
                  <option value="WEIGHT_LOSS">Perda de Peso</option>
                  <option value="MUSCLE_GAIN">Ganho Muscular</option>
                  <option value="MAINTENANCE">Manutenção</option>
                </select>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </button>

              <Link href="/login" className="block text-center text-blue-600 hover:underline">
                ← Voltar para Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
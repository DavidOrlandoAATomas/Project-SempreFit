// frontend/src/contexts/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User, refreshToken?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Carregar do localStorage e cookies
      const savedToken = localStorage.getItem("accessToken");
      const cookieToken = Cookies.get("accessToken");
      const savedUser = localStorage.getItem("user");
      
      // Usar o token disponível
      const finalToken = savedToken || cookieToken || null;
      
      setToken(finalToken);
      
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
    }
    setLoading(false);
  }, []);

  function login(token: string, user: User, refreshToken?: string) {
    if (typeof window !== "undefined") {
      // Salvar em localStorage
      localStorage.setItem("accessToken", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Salvar em cookies para o middleware
      Cookies.set("accessToken", token, { expires: 7 }); // 7 dias
      if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 30 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
    }
    setToken(token);
    setUser(user);
  }

  function logout() {
    if (typeof window !== "undefined") {
      // Remover do localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Remover dos cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
    }
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";
import { IPrestador } from "../../../shared/entities";

// --- 1. Definições ---
interface AuthContextType {
  prestador: IPrestador | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  api: AxiosInstance; // Instância do Axios pré-configurada
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 2. O Provedor de Contexto (Lógica Central) ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [prestador, setPrestador] = useState<IPrestador | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("agendou_token")
  );

  // Instância do Axios: USAR ESTA PARA TODAS AS CHAMADAS PROTEGIDAS
  const api = axios.create({
    baseURL: "http://localhost:4000/api/v1", // URL base do seu backend
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Interceptor para adicionar o token automaticamente
  api.interceptors.request.use((config: any) => {
    const currentToken = localStorage.getItem("agendou_token");
    if (currentToken) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${currentToken}`;
    }
    return config;
  });

  // Função de Login (Chama a rota de Autenticação do Backend - Tarefa 1)
  const login = async (email: string, senha: string) => {
    try {
      // NOTE: Rota de Autenticação (POST /auth/login) precisa ser criada no backend primeiro
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        { email, senha }
      );

      const { token: newToken, prestador: prestadorData } = response.data;

      // Armazena o token de forma persistente (LocalStorage simples para o MVP)
      localStorage.setItem("agendou_token", newToken);
      setToken(newToken);
      setPrestador(prestadorData);

      // Futuro: Lógica de refresh token e manipulação de erro 401.
    } catch (err: unknown) {
      const error = err as any;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Email ou senha inválidos.");
      }
      throw new Error("Erro ao tentar conectar ao servidor.");
    }
  };

  const logout = () => {
    localStorage.removeItem("agendou_token");
    setToken(null);
    setPrestador(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ prestador, token, isAuthenticated, login, logout, api }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- 3. Hook para Usar o Contexto ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

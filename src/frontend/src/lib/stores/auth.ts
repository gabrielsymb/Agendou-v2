import { writable } from "svelte/store";
import { api } from "../../services/api.js";
import { showToast } from "../../features/toast/store.js";

const TOKEN_KEY = "agendou_token";

export type Prestador = {
  id: string;
  prestadorId: string;
  nome: string;
  email: string;
};

const tokenStore = writable<string | null>(null);
const prestadorStore = writable<Prestador | null>(null);

function loadFromStorage() {
  try {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) tokenStore.set(t);
    const p = localStorage.getItem("agendou_prestador");
    if (p) prestadorStore.set(JSON.parse(p));
  } catch (e) {
    // ignore
  }
}

function setSession(token: string, prestador: Prestador) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem("agendou_prestador", JSON.stringify(prestador));
  } catch (e) {}
  tokenStore.set(token);
  prestadorStore.set(prestador);
  showToast("Login efetuado", "success");
}

function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("agendou_prestador");
  } catch (e) {}
  tokenStore.set(null);
  prestadorStore.set(null);
}

async function login(email: string, senha: string) {
  const data: any = await api.post("/api/v1/auth/login", { email, senha });
  // backend returns { message, prestador, token }
  if (data && data.token && data.prestador) {
    setSession(data.token, data.prestador);
    return data.prestador;
  }
  throw new Error("Resposta de login inválida");
}

function logout() {
  clearSession();
  showToast("Sessão encerrada", "info");
}

loadFromStorage();

export const auth = {
  token: { subscribe: tokenStore.subscribe },
  prestador: { subscribe: prestadorStore.subscribe },
  login,
  logout,
  setSession,
  clearSession,
};

export default auth;

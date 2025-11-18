import { writable } from 'svelte/store';
import { showToast } from '../features/toast/store.js';
import { api } from '../services/api.js';

const tokenStore = writable<string | null>(null);
const userStore = writable<any | null>(null);
const TOKEN_KEY = 'agendou_token';

function load(){ try{ const t = localStorage.getItem(TOKEN_KEY); if(t) tokenStore.set(t); }catch(e){} }

export async function login(email:string, senha:string){ const data:any = await api.post('/api/v1/auth/login',{email,senha}); if(data && data.token){ localStorage.setItem(TOKEN_KEY,data.token); tokenStore.set(data.token); userStore.set(data.prestador); showToast('Login efetuado','success'); return data.prestador } throw new Error('Invalid login response') }

export function logout(){ localStorage.removeItem(TOKEN_KEY); tokenStore.set(null); userStore.set(null); showToast('Sessão encerrada','info'); }

load();

export const auth = { token: { subscribe: tokenStore.subscribe }, user: { subscribe: userStore.subscribe }, login, logout };

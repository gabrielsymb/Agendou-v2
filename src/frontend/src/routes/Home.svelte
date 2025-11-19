<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '../components/Card.svelte';
  import FAB from '../components/FAB.svelte';
  import BottomNav from '../components/BottomNav.svelte';
  import { auth } from '../lib/stores/auth';
  import { api } from '../services/api';
  import { navigate } from '../lib/router';

  let prestador: any = null;
  let services: Array<any> = [];
  let loading = false;
  let error: string | null = null;

  onMount(() => {
    // proteger rota: se não houver token/usuário, redireciona para login
    const unsubToken = auth.token.subscribe((t: string | null) => {
      if (!t) navigate('/login');
    });

    const unsubPrest = auth.prestador.subscribe((p: any) => {
      prestador = p;
    });

    fetchServices();

    return () => {
      unsubToken();
      unsubPrest();
    };
  });

  async function fetchServices() {
    loading = true;
    error = null;
    try {
      const res: any = await api.get('/api/v1/servicos');
      services = res?.servicos ?? [];
    } catch (err: any) {
      error = err?.message ?? String(err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="container-mobile">
  <Card>
    <h2>Bem-vindo{#if prestador && prestador.nome}, {prestador.nome}{/if}!</h2>
    <p class="text-muted">Aqui estão seus serviços e um resumo rápido do backend.</p>

    {#if loading}
      <p>Carregando...</p>
    {:else if error}
      <p class="text-muted">Erro ao carregar: {error}</p>
    {:else}
      {#if services.length === 0}
        <p class="text-muted">Nenhum serviço cadastrado.</p>
      {:else}
        <ul class="services">
          {#each services as s}
            <li class="service-item">
              <strong>{s.nome}</strong>
              <div class="muted">{s.descricao ?? ''}</div>
            </li>
          {/each}
        </ul>
      {/if}
    {/if}

  </Card>
</div>
<FAB />
<BottomNav />

<style>
  .services { list-style: none; padding: 0; margin: 0; display: grid; gap: .6rem; }
  .service-item { padding: .6rem; background: rgba(255,255,255,0.02); border-radius: 8px; }
  .muted { color: rgba(255,255,255,0.7); font-size: .9rem }
</style>

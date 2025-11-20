<script lang="ts">
  import { onMount } from 'svelte';
  import api from '../services/api';
  import Card from '../components/Card.svelte';
  import CardInteractive from '../components/CardInteractive.svelte';
  import Spinner from '../components/Spinner.svelte';
  import FAB from '../components/FAB.svelte';
  import DndContextWrapper from '../components/dnd/DndContextWrapper.svelte';
  import SortableList from '../components/dnd/SortableList.svelte';
  import SortableItem from '../components/dnd/SortableItem.svelte';
  import Section from '../components/layout/Section.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import SkeletonList from '../components/SkeletonList.svelte';
  import Button from '../components/Button.svelte';

  let agendamentos: any[] = [];
  let loading: boolean = false;
  let error: string = '';
  const dateToday: string = new Date().toISOString().substring(0,10); // YYYY-MM-DD

  async function fetchAgendamentos(dateStr: string) {
    loading = true;
    error = '';
    try {
      const res = await api.get(`/api/v1/agendamentos?data=${dateStr}`);
      agendamentos = res.data || [];
    } catch (err) {
      error = 'Erro ao buscar agendamentos';
    } finally {
      loading = false;
    }
  }

  // Home apenas recebe o evento reorder do wrapper; tipado como CustomEvent
  async function onReorder(event: CustomEvent<{ orderedIds: Array<number|string>, items: any[] }>) {
    const detail = event.detail ?? {};
    const { orderedIds, items } = detail;
    if (!orderedIds || !Array.isArray(orderedIds)) return;

    // otimista: atualiza UI local
    agendamentos = items ?? agendamentos;

    try {
      await api.put('/api/v1/agendamentos/reorder', { agendamentoIds: orderedIds });
    } catch (err) {
      // em caso de erro, refetch para sincronizar
      await fetchAgendamentos(dateToday);
    }
  }

  onMount(() => {
    fetchAgendamentos(dateToday);
  });
</script>

<Section padded>
  <div class="container-mobile">
    
    {#if loading}
      <SkeletonList rows={4} />
    {:else if !agendamentos || agendamentos.length === 0}
      <EmptyState title="Nenhum agendamento" subtitle="Você não possui agendamentos para hoje.">
        <Button slot="actions" on:click={() => fetchAgendamentos(dateToday)}>Recarregar</Button>
      </EmptyState>
    {:else}
      <DndContextWrapper items={agendamentos} on:reorder={onReorder} on:change={(e) => { agendamentos = e.detail.items }} let:itemsLocal>
      <SortableList {itemsLocal}>
        {#each itemsLocal as ag (ag.id)}
          <SortableItem id={ag.id}>
            <CardInteractive>
              <div class="row">
                <div><strong>{ag.clienteNome}</strong></div>
                <div class="muted">{new Date(ag.dataHoraInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              </div>
              <div class="muted">{ag.servicoNome} • pos {ag.posicao}</div>
            </CardInteractive>
          </SortableItem>
        {/each}
      </SortableList>
      </DndContextWrapper>
    {/if}
  </div>
</Section>
<FAB />

<style>
  .muted { color: rgba(255,255,255,0.7); font-size: .9rem }
</style>

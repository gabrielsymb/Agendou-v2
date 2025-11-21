<script lang="ts">
  import { onMount } from 'svelte';
  import api from '../services/api';
  import Card from '../components/Card.svelte';
  import CardInteractive from '../components/CardInteractive.svelte';
  import Spinner from '../components/Spinner.svelte';
  import DndContextWrapper from '../components/dnd/DndContextWrapper.svelte';
  import SortableList from '../components/dnd/SortableList.svelte';
  import SortableItem from '../components/dnd/SortableItem.svelte';
  import AgendaList from '../components/agenda/AgendaList.svelte';
  import Section from '../components/layout/Section.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import SkeletonList from '../components/SkeletonList.svelte';
  import Button from '../components/Button.svelte';
  import { showToast } from '../features/toast/store';

  let agendamentos: any[] = [];
  let loading: boolean = false;
  let saving: boolean = false;
  let error: string = '';
  const dateToday: string = new Date().toISOString().substring(0,10); // YYYY-MM-DD

  async function fetchAgendamentos(dateStr: string) {
    loading = true;
    error = '';
    try {
  const res = await api.get(`/api/v1/agendamentos?data=${dateStr}`);
  // backend may return the array directly or { data: [...] }
  console.log('[Home] raw response from api.get:', res);
  agendamentos = Array.isArray(res) ? res : (res && (res as any).data) ? (res as any).data : [];
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

    saving = true;
    // micro-toast de salvando (curta duração)
    showToast('Salvando alterações...', 'info', 900);
    try {
  await api.put('/api/v1/agendamentos/reorder', { agendamentoIds: orderedIds });
      showToast('Alterações salvas', 'success', 2000);
    } catch (err) {
      // em caso de erro, refetch para sincronizar
      await fetchAgendamentos(dateToday);
      showToast('Erro ao salvar alterações', 'error', 4000);
    } finally {
      saving = false;
    }
  }

    async function onConclude(e: CustomEvent<{ id: number|string }>) {
      const id = e.detail?.id;
      if (!id) return;
      try {
    await api.put(`/api/v1/agendamentos/${id}`, { status: 'concluido' });
    // micro-feedback: vibrate on success (if available)
    try { navigator.vibrate?.(60); } catch (err) {}
    showToast('Agendamento concluído', 'success');
    await fetchAgendamentos(dateToday);
      } catch (err) {
        showToast('Erro ao concluir agendamento', 'error');
      }
    }

    async function onCancel(e: CustomEvent<{ id: number|string }>) {
      const id = e.detail?.id;
      if (!id) return;
      try {
    await api.put(`/api/v1/agendamentos/${id}`, { status: 'cancelado' });
    try { navigator.vibrate?.(60); } catch (err) {}
    showToast('Agendamento cancelado', 'success');
    await fetchAgendamentos(dateToday);
      } catch (err) {
        showToast('Erro ao cancelar agendamento', 'error');
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
        <Button slot="actions" loading={loading} on:click={() => fetchAgendamentos(dateToday)}>Recarregar</Button>
      </EmptyState>
    {:else}
    <!-- AgendaList with DnD -->
  <AgendaList items={agendamentos} on:reorder={onReorder} on:conclude={onConclude} on:cancel={onCancel} />
    {/if}
  </div>
  </Section>

<style>
</style>

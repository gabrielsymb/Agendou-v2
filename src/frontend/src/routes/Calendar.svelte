<script lang="ts">
  import Section from '../components/layout/Section.svelte';
  import SkeletonList from '../components/SkeletonList.svelte';
  let loading = false;
  let eventos = [
    { id:1, title: 'Consulta - Ana', time: '09:00' },
    { id:2, title: 'Corte - João', time: '11:30' }
  ];
</script>

<Section padded>
  <h2>Agenda</h2>
  {#if loading}
    <SkeletonList rows={4} />
  {:else}
    <div class="events">
      {#each eventos as ev}
        <div class="event"><strong>{ev.time}</strong> — {ev.title}</div>
      {/each}
    </div>
  {/if}
</Section>

<style>
  .events { display:flex; flex-direction:column; gap:8px }
  .event { padding:12px; background:var(--color-surface); border-radius:8px }
</style>

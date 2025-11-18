<script lang="ts">
  import toasts, { removeToast } from './store';
  import { fly, fade } from 'svelte/transition';
  import { onDestroy } from 'svelte';
  let list = [] as any[];
  const unsub = toasts.subscribe(v=> list = v);
  onDestroy(()=> unsub());
</script>

<style>
  .toast-root{ position:fixed; right:1rem; bottom:1rem; display:flex; flex-direction:column; gap:.5rem; z-index:9999 }
  .toast-item{ background:var(--agendou-card); color:var(--text-on-dark); padding:.6rem .9rem; border-radius:8px; min-width:200px; box-shadow:0 6px 12px rgba(0,0,0,0.3) }
</style>

<div class="toast-root">
  {#each list as t (t.id)}
    <div class="toast-item" in:fade out:fade>
      <div>{t.message}</div>
  <button aria-label="Fechar notificação" title="Fechar" on:click={() => removeToast(t.id)}>✕</button>
    </div>
  {/each}
</div>

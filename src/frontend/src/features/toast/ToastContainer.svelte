<script lang="ts">
  import { toasts } from '../../stores/toast';
  import Toast from './Toast.svelte';

  function handleClose(e: CustomEvent) {
    const id = e.detail?.id;
    if (id) toasts.remove(id);
    else if (e.detail) toasts.remove(e.detail);
  }
</script>

<div class="toast-container" aria-live="polite">
  {#each $toasts as t (t.id)}
    <button
      class="wrap"
      type="button"
      aria-label="Fechar notificação"
      on:click={() => toasts.remove(t.id)}
    >
      <Toast
        id={t.id}
        message={t.message}
        type={t.type ?? 'success'}
        duration={t.timeout ?? 3200}
        on:close={handleClose}
      />
    </button>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    display:flex;
    flex-direction:column;
    gap:0.6rem;
    pointer-events: none;
    max-width: calc(100vw - 2rem);
  }
  /* botão sem estilo, mas acessível */
  .wrap {
    pointer-events: auto;
    background: transparent;
    border: 0;
    padding: 0;
    text-align: left;
    width: 100%;
    cursor: pointer;
  }
  .wrap:focus-visible { outline: 3px solid rgba(7,17,48,0.12); border-radius: 8px; }
  @media (max-width: 520px) {
    .toast-container { left: 1rem; right: 1rem; top: auto; bottom: 1rem; align-items: center; }
    .wrap { width: 100%; display:flex; justify-content:center; }
  }
</style>

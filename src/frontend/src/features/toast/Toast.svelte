<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  export let message: string = '';
  export let type: 'success' | 'error' = 'success';
  export let duration: number = 3200; // ms
  export let id: string | null = null;

  let progressStyle = '';
  let mounted = false;

  onMount(() => {
  // controla barra de progresso via CSS
  progressStyle = `--duration: ${duration}ms`;
    mounted = true;
  });

  function close() {
    if (id) dispatch('close', { id });
    else dispatch('close');
  }
</script>

<div class="toast" role="status" aria-live="polite" data-type={type} style={progressStyle}>
  <div class="left">
      {#if type === 'success'}
        <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="var(--toast-success-icon, #0f5132)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>
      {:else}
        <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="var(--toast-error-icon, #6b021d)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      {/if}
  </div>

  <div class="body">
    <div class="message">{message}</div>
    <div class="meta">
      <button class="close" aria-label="Fechar" on:click={close}>&times;</button>
    </div>
    <div class="progress" aria-hidden="true" class:running={mounted}></div>
  </div>
</div>

<style>
  :global(.toast) { box-sizing: border-box; }

  .toast {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 12px 10px 12px;
  border-radius: 16px;
    min-width: 220px;
    max-width: 360px;
      color: var(--toast-text-color, var(--color-text-primary, #071130));
  box-shadow: 0 10px 30px rgba(2,6,23,0.12);
    transform: translateX(16px);
    opacity: 0;
    animation: slideIn 260ms cubic-bezier(.2,.9,.2,1) forwards;
    position: relative;
    overflow: hidden;
  }

  .left { margin-top: 2px; }

  .icon { display:block; }

  .body { flex: 1; display:flex; flex-direction:column; gap:6px; }

  .message { font-size: 14px; line-height: 1.25; word-break: break-word; }

  .meta { display:flex; justify-content:flex-end; align-items:center; gap:8px; }

  .close {
    background: transparent;
    border: 0;
    font-size: 18px;
    line-height: 1;
    color: rgba(7,17,48,0.6);
    cursor: pointer;
    padding: 0 4px;
    border-radius: 6px;
  }
  .close:hover { background: rgba(2,6,23,0.06); }

  /* colors by type */
  .toast[data-type="success"] { background: linear-gradient(180deg, var(--toast-success-bg-from, #ecfff7) 0%, var(--toast-success-bg-to, #e6fff2) 100%); border: var(--toast-success-border, 1px solid rgba(15,129,88,0.12)); }
  .toast[data-type="error"] { background: linear-gradient(180deg, var(--toast-error-bg-from, #fff6f7) 0%, var(--toast-error-bg-to, #fff1f2) 100%); border: var(--toast-error-border, 1px solid rgba(203,36,68,0.08)); }

  /* progress bar */
  .progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 100%;
    background: linear-gradient(90deg, rgba(7,17,48,0.18), rgba(7,17,48,0.06));
    transform-origin: left;
    transform: scaleX(1);
  }
  .progress.running {
    animation: shrink linear forwards;
    animation-duration: var(--duration, 4000ms);
  }

  @keyframes shrink {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }

  @keyframes slideIn {
    to { transform: translateX(0); opacity: 1; }
  }
</style>
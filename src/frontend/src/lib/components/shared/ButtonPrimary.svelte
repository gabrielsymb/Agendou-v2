<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let variant: 'primary' | 'register' = 'primary';
  export let disabled: boolean = false;
  const dispatch = createEventDispatcher();

  function handleClick(e: any) {
    if (disabled) return;
    // re-dispara click como CustomEvent com o evento original no detail
    const original = e && e.detail ? e.detail : e;
    dispatch('click', { originalEvent: original });
  }
</script>

<button
  class="btn {variant}"
  on:click={handleClick}
  aria-disabled={disabled}
  disabled={disabled}
  {...$$restProps}
>
  <slot />
</button>

<style>
  /* cor primária alinhada ao Manifesto UX (accent) */
  :root { --accent: #34d399; }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 16px;
    min-width: 120px;
    min-height: 44px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    background: var(--accent);
    color: #071013;
    font-weight: 700;
    font-size: 16px;
  }

  /* variante de registro (outline) */
  .btn.register {
    background: transparent;
    color: var(--accent);
    border: 1px solid rgba(52,211,153,0.12);
  }

  .btn[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* feedback tátil */
  .btn:active { transform: scale(0.98); transition: transform 120ms; }
</style>

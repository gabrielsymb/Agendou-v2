<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let className = '';
  export let tabindex: string | number | undefined = 0;
  // allow choosing tag if consumer wants <div>, <button> or <a>
  export let tag: 'div' | 'button' | 'a' = 'button';
  const dispatch = createEventDispatcher();
  // other attributes/events are available via $$restProps automatically
</script>

{#if tag === 'button'}
  <button
    class={`ag-card interactive ${className}`}
    tabindex={tabindex != null ? +tabindex : undefined}
    on:click={(e) => dispatch('click', e)}>
    <slot />
  </button>
{:else}
  <div
    class={`ag-card interactive ${className}`}
    role="button"
    tabindex={tabindex != null ? +tabindex : undefined}
    on:click={(e) => dispatch('click', e)}
    on:keydown={(e) => {
      const key = e.key;
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        dispatch('click', e);
      }
    }}>
    <slot />
  </div>
{/if}

<style>
  .ag-card.interactive {
    transition: transform var(--duration-fast, 120ms) var(--easing-standard, cubic-bezier(0.25,0.1,0.25,1)),
                box-shadow var(--duration-fast, 120ms) var(--easing-standard, cubic-bezier(0.25,0.1,0.25,1));
  }

  .ag-card.interactive:hover,
  .ag-card.interactive:focus-visible {
    /* micro-slide (2px) + subtle shadow */
    transform: translateY(-2px) scale(1.01);
    box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.10));
    cursor: pointer;
    outline: none;
  }

  /* Ensure button reset when using <button> to avoid default styles */
  .ag-card.interactive:where(button) {
    background: inherit;
    border: none;
    padding: 0;
    font: inherit;
    color: inherit;
  }
</style>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();
  export let progress = 0; // 0..1
  export const width = 0;
  export const index = 0;
  let el: HTMLElement | null = null;

  // expose a small API for parent
  export function setProgress(p: number) {
    progress = p;
  }
</script>

<div class="tab-pill" bind:this={el} style="transform: translateX(calc(var(--pill-offset, 0px))) scale(1);">
  <slot />
</div>

<style>
  .tab-pill {
    --duration: 180ms;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 9999px;
    background: var(--component-tabbar-pill-bg, #f0f0f0);
    transition: transform var(--duration) cubic-bezier(0.19, 1, 0.22, 1);
    will-change: transform;
  }
</style>

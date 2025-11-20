<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();
  export let disabled = false; // disables swipe
  let container: HTMLElement | null = null;
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  function pointerDown(e: PointerEvent) {
    if (disabled) return;
    dragging = true;
    startX = e.clientX;
    dispatch('swipestart');
  }

  function pointerMove(e: PointerEvent) {
    if (!dragging) return;
    currentX = e.clientX - startX;
    const progress = Math.min(Math.max(currentX / (container?.clientWidth || 1), -1), 1);
    dispatch('swipeprogress', { progress });
  }

  function pointerUp(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    const progress = Math.min(Math.max(currentX / (container?.clientWidth || 1), -1), 1);
    dispatch('swipeend', { progress });
    startX = 0; currentX = 0;
  }
</script>

<div class="swipeable" bind:this={container} on:pointerdown={pointerDown} on:pointermove={pointerMove} on:pointerup={pointerUp} on:pointercancel={pointerUp}>
  <slot />
</div>

<style>
  .swipeable {
    touch-action: pan-y;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>

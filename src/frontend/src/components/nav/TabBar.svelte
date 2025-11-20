<script lang="ts">
  import TabPill from './TabPill.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let items: Array<{ id: string; label: string }> = [];
  export let activeIndex = 0;

  function onTap(i: number) {
    dispatch('tabtap', { index: i });
  }
</script>

<nav class="tabbar">
  {#each items as it, i}
    <button class="tabbar__item" on:click={() => onTap(i)} aria-pressed={i===activeIndex}>
      <span class="tabbar__icon"></span>
      {#if i === activeIndex}
        <TabPill><span class="tabbar__label">{it.label}</span></TabPill>
      {/if}
    </button>
  {/each}
</nav>

<style>
  .tabbar {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-around;
    height: var(--component-tabbar-height, 64px);
    background: var(--component-tabbar-bg, var(--color-surface, #ffffff));
    box-shadow: var(--component-tabbar-shadow, 0 1px 2px rgba(0,0,0,0.06));
    padding: 0 12px;
  }

  .tabbar__item {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .tabbar__icon {
    display: inline-flex;
    width: 22px;
    height: 22px;
  }

  .tabbar__label {
    font-size: 14px;
    padding-left: 8px;
  }
</style>

<script lang="ts">
  import TabBar from '../nav/TabBar.svelte';
  import { onMount } from 'svelte';
  import { navigate } from '../../lib/router';

  export let padded = true;
  export let max = true;
  // showTabbar controls whether the global TabBar is rendered (only for logged-in/private views)
  export let showTabbar: boolean = false;

  const items = [
  { id: 'home', label: 'Início', path: '/home', icon: 'material-symbols:home-rounded' },
  { id: 'calendar', label: 'Agenda', path: '/calendar', icon: 'material-symbols:event-rounded' },
  { id: 'profile', label: 'Perfil', path: '/settings', icon: 'material-symbols:settings-rounded' }
  ];

  let activeIndex = 0;

  function resolveIndex(path: string) {
    const p = path || '/';
    const idx = items.findIndex(it => it.path === p);
    return idx >= 0 ? idx : 0;
  }

  function handleTabTap(e: CustomEvent) {
    const i = e.detail?.index ?? 0;
    const it = items[i];
    if (it && it.path) navigate(it.path);
  }

  onMount(() => {
    activeIndex = resolveIndex(location.pathname);
    const onPop = () => activeIndex = resolveIndex(location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  });
</script>

<div
  class="layout-container"
  style="
    padding-inline: {padded ? 'var(--container-padding)' : '0'};
    max-width: {max ? 'var(--container-max)' : 'none'};
    margin-inline: auto;
    padding-bottom: {showTabbar ? 'calc(var(--component-tabbar-height, 64px) + 24px)' : '0'};
  "
>
  <slot />

  {#if showTabbar}
    <TabBar {items} bind:activeIndex on:tabtap={handleTabTap} />
  {/if}
</div>

<style>
  .layout-container {
    width: 100%;
    display: block;
  }

  

  /* Removed old global tabbar rules to allow full-bleed TabBar */
</style>

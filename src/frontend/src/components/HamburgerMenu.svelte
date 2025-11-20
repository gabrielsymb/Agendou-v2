<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import { auth } from '../lib/stores/auth';
  import { navigate } from '../lib/router';
  import { onDestroy } from 'svelte';
  import Logo from './Logo.svelte';

  // control whether the logo animates. Set to false to disable animation
  export let logoAnimated: boolean = true;

  const dispatch = createEventDispatcher();

  let open = false;
  let token: string | null = null;
  let hamburgerBtn: HTMLButtonElement | null = null;
  let panelEl: HTMLElement | null = null;

  // Note: we'll set `aria-hidden` and `inert` directly in the markup.

  const unsub = auth.token.subscribe(t => token = t);
  onDestroy(() => unsub());

  function onOverlayKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); }
  }

  function toggle() {
    open = !open;
  }

  function close() {
    // if any element inside the panel is focused, move focus back to the hamburger button
    // before hiding the panel to avoid aria-hidden on a focused descendant.
    if (panelEl && document.activeElement && panelEl.contains(document.activeElement)) {
      if (hamburgerBtn) hamburgerBtn.focus();
    }

    open = false;
  }

  function go(path: string) {
    close();
    navigate(path);
  }

  function doLogout() {
    auth.logout();
    close();
    navigate('/login');
  }

  // ensure aria-hidden and inert attributes are updated on the panel element
  $: if (panelEl) {
    panelEl.setAttribute('aria-hidden', (!open).toString());
    if (!open) panelEl.setAttribute('inert', '');
    else panelEl.removeAttribute('inert');
  }

</script>

<button class="hamburger" bind:this={hamburgerBtn} on:click={toggle} aria-label="Abrir menu" aria-expanded={open}>
  <Icon icon={open ? 'mdi:close' : 'mdi:menu'} width="28" height="28" />
</button>

{#if open}
  <div class="hm-overlay" role="button" tabindex="0" on:click={close} on:keydown={onOverlayKey}></div>
{/if}

<nav bind:this={panelEl} class:open class="hm-panel">
  <div class="hm-header">
  <div class="hm-logo"><Logo size={42} animated={logoAnimated} white={true} /></div>
  <div class="hm-title">Agendou!</div>
  </div>

  <ul class="hm-list">
    <li><button type="button" class="hm-item" on:click={() => go('/home')}><Icon icon="mdi:home" /> <span>Início</span></button></li>
    <li><button type="button" class="hm-item" on:click={() => go('/calendar')}><Icon icon="mdi:calendar" /> <span>Agenda</span></button></li>
    {#if token}
      <li><button type="button" class="hm-item" on:click={() => go('/clientes')}><Icon icon="mdi:account-multiple" /> <span>Clientes</span></button></li>
      <li><button type="button" class="hm-item" on:click={() => go('/servicos')}><Icon icon="mdi:briefcase" /> <span>Serviços</span></button></li>
      <li><button type="button" class="hm-item" on:click={() => go('/settings')}><Icon icon="mdi:cog" /> <span>Configurações</span></button></li>
    {:else}
      <li><button type="button" class="hm-item" on:click={() => go('/login')}><Icon icon="mdi:login" /> <span>Entrar</span></button></li>
      <li><button type="button" class="hm-item" on:click={() => go('/register')}><Icon icon="mdi:account-plus" /> <span>Criar conta</span></button></li>
    {/if}
  </ul>

  <div class="hm-footer">
    <button type="button" class="logout" on:click={doLogout}><Icon icon="mdi:logout" /> Sair</button>
  </div>
</nav>


<style>
  /* ManifestoUX tokens applied: dark theme */
  .hamburger {
    position: fixed;
    left: 12px;
    top: 12px;
    z-index: 1200;
    background: transparent;
    border: none;
    color: var(--text, #FFFFFF);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px; /* touch target >= 44 */
    height: 48px; /* touch target */
    padding: 6px; /* hit area */
    border-radius: 10px;
    cursor: pointer;
  }

  .hm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.48);
    z-index: 1190;
    backdrop-filter: blur(6px);
    transition: opacity 240ms ease, backdrop-filter 240ms ease;
    opacity: 1;
  }

  .hm-panel {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: min(320px, 76vw);
    background: var(--panel, #1E1E1E);
    color: var(--text, #FFFFFF);
    box-shadow: 4px 0 24px rgba(0,0,0,0.4);
    transform: translateX(-105%);
    transition: transform 320ms cubic-bezier(.2,.8,.2,1);
    z-index: 1200;
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 0 18px 18px 0; /* rounded right side */
  }

  .hm-panel.open {
    transform: translateX(0);
  }

  .hm-header { padding: 8px 0 12px; border-bottom: 1px solid rgba(255,255,255,0.03); display:flex; align-items:center; gap:10px; }
  .hm-logo { display:flex; align-items:center; justify-content:flex-start; padding-left:2px; }
  .hm-title { font-weight: 700; font-size: 1rem; margin-left: 4px; }

  .hm-list { list-style: none; padding: 12px 0; margin: 0; display: grid; gap: 8px; }
  .hm-list li { list-style: none; }
  .hm-item { display:flex; gap: 12px; align-items:center; padding: 12px; border-radius:8px; cursor: pointer; min-height:44px; width:100%; background: transparent; border: none; color: inherit; text-align: left; }
  .hm-item:hover { background: rgba(255,255,255,0.02); }
  .hm-item :global(svg) { color: var(--agendou-primary, #1DB954); width:26px; height:26px; }
  .hm-item span { font-size: 1rem; color: var(--text, #FFFFFF); }

  .hm-footer { margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.03); }
  .logout { width: 100%; display:flex; align-items:center; gap:10px; padding:10px; border-radius:8px; background: transparent; border: var(--component-button-border-weak, 1px solid rgba(255,255,255,0.04)); color: var(--text, #FFFFFF); cursor: pointer; }
  .logout :global(svg) { color: #ff6b6b; width:22px; height:22px; }

  @media (min-width: 900px) {
    .hamburger { left: 24px; top: 24px; }
  }
</style>

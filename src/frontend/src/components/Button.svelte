<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CardInteractive from './CardInteractive.svelte';
  import Spinner from './Spinner.svelte';
  // reference imported component to avoid unused-import tooling issues
  const _CardInteractiveRef = CardInteractive;
  const dispatch = createEventDispatcher();

  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let variant: 'primary' | 'secondary' | 'destructive' | 'register' | 'welcome' = 'primary';
  export let disabled: boolean = false;
  export let ariaLabel: string | undefined = undefined;
  export let loading: boolean = false;
  // when undefined, default interactive for primary and welcome variants
  export let interactive: boolean | undefined = undefined;
  // derived flag for rendering
  $: _effectiveInteractive = (interactive === undefined ? (variant === 'primary' || variant === 'welcome') : interactive);
  // outros props serão encaminhados automaticamente via {...$$restProps}

  function handleClick(e: MouseEvent) {
    // não disparar ação quando disabled ou loading
    if (disabled || loading) return;
    // reemitir como evento do componente para consumidores que usam <Button on:click>
    dispatch('click', e);
  }
</script>

<button
  type={type}
  class={`ag-btn ag-btn--${variant} ${_effectiveInteractive ? 'interactive' : ''}`}
  aria-label={ariaLabel}
  disabled={disabled}
  on:click={handleClick}
  {...$$restProps}
>
  <span class="ag-btn__content">
    <slot name="icon-left" />
    {#if loading}
      <span class="ag-btn__label"><!-- spinner -->
        <Spinner size={18} />
      </span>
    {:else}
      <span class="ag-btn__label"><slot /></span>
    {/if}
    <slot name="icon-right" />
  </span>
</button>

<style>
  .ag-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: var(--component-button-min-height, 48px);
    box-sizing: border-box;
    border: none;
    font-family: var(--font-family-base, Inter), sans-serif;
    font-weight: 600;
    line-height: 1;
    color: var(--color-text-primary, #2C2C2C);
    background: transparent;
    cursor: pointer;
    transition: background var(--duration-base, 180ms) var(--easing-standard, cubic-bezier(0.22, 1, 0.36, 1)),
      transform var(--duration-base, 180ms) var(--easing-standard, cubic-bezier(0.22, 1, 0.36, 1)),
      box-shadow var(--duration-base, 180ms) var(--easing-standard, cubic-bezier(0.22, 1, 0.36, 1));
    -webkit-tap-highlight-color: transparent;
  }

  /* Interactive lift similar to CardInteractive */
  .ag-btn.interactive {
    transition: transform var(--duration-fast, 120ms) var(--easing-standard, cubic-bezier(0.25,0.1,0.25,1)),
                box-shadow var(--duration-fast, 120ms) var(--easing-standard, cubic-bezier(0.25,0.1,0.25,1));
  }

  .ag-btn.interactive:hover:not(:disabled),
  .ag-btn.interactive:focus-visible {
    transform: translateY(-2px) scale(1.01);
    box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.10));
  }

  .ag-btn__content {
    display: inline-flex;
    align-items: center;
    gap: var(--s8, 8px);
    width: 100%;
    justify-content: center;
    padding: 0;
  }

  .ag-btn__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  padding: 0 var(--s16, 16px);
  font-weight: var(--font-weight-medium, 500);
  }

  /* Icon slot sizing */
  ::slotted([slot="icon-left"]), ::slotted([slot="icon-right"]) {
    display: inline-flex;
    width: 18px;
    height: 18px;
    align-items: center;
    justify-content: center;
  }

  /* PRIMARY */
  .ag-btn--primary {
    background: var(--color-accent-primary, #FF7957);
    color: var(--color-text-inverse, #FFFFFF);
    padding: var(--s12, 12px) var(--s16, 16px);
  border-radius: var(--component-button-radius, 16px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  /* ensure label weight for primary-style buttons is semibold as per UX */
  .ag-btn--primary .ag-btn__label,
  .ag-btn--welcome .ag-btn__label {
    font-weight: var(--font-weight-semibold, 600);
  }

  .ag-btn--primary:hover:not(:disabled) {
    filter: brightness(1.03);
  }

  .ag-btn--primary:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    filter: brightness(0.94);
  }

  /* SECONDARY */
  .ag-btn--secondary {
    background: var(--color-surface, #FFFFFF);
    color: var(--color-accent-primary, #E46B4C);
    padding: var(--s12, 12px) var(--s16, 16px);
  border-radius: var(--component-button-radius, 16px);
    border: var(--component-button-border, 1px solid rgba(0,0,0,0.06));
    box-shadow: none;
  }

  .ag-btn--secondary:hover:not(:disabled) {
    filter: brightness(1.03);
  }

  .ag-btn--secondary:active:not(:disabled) {
    transform: scale(0.97);
  }

  /* GHOST */
  .ag-btn--ghost {
    background: transparent;
    color: var(--color-text-primary, #2C2C2C);
    padding: var(--s12, 12px) var(--s16, 16px);
  border-radius: var(--component-button-radius, 16px);
    border: none;
  }

  /* DESTRUCTIVE */
  .ag-btn--destructive {
    background: var(--color-destructive, #B3261E);
    color: var(--color-surface, #FFFFFF);
    padding: var(--s12, 12px) var(--s16, 16px);
  border-radius: var(--component-button-radius, 16px);
  }

  /* PILL */
  .ag-btn--pill {
    background: var(--color-surface, #FFFFFF);
    color: var(--color-text-primary, #2C2C2C);
    padding: var(--s12, 12px) calc(var(--s16,16px) * 1.5);
  border-radius: var(--r-pill, 9999px);
  border: var(--component-button-border, 1px solid rgba(0,0,0,0.06));
  }

  /* ICON-ONLY */
  .ag-btn--icon-only {
    background: transparent;
  padding: 0;
  width: var(--component-button-min-height, 48px);
  height: var(--component-button-min-height, 48px);
  border-radius: var(--component-button-radius, 16px);
  }

  /* Register variant kept for backward compatibility -> map to primary style */
  /* REGISTER should behave as secondary/outline per design spec */
  .ag-btn--register {
    background: transparent;
    color: var(--color-text-primary, #2C2C2C);
    padding: var(--s12, 12px) var(--s16, 16px);
    border-radius: var(--component-button-radius, 16px);
  border: var(--component-button-border, 1px solid rgba(0,0,0,0.06));
    box-shadow: none;
  }

  .ag-btn--register .ag-btn__label {
    font-weight: var(--font-weight-medium, 500);
  }

  /* WELCOME - special accent used on welcome screen */
  .ag-btn--welcome {
    background: var(--color-accent-welcome, var(--color-accent-primary, #FF7957));
    color: var(--color-surface, #FFFFFF);
    padding: var(--s12, 12px) var(--s16, 16px);
    border-radius: var(--component-button-radius, 16px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .ag-btn--welcome:hover:not(:disabled) {
    filter: brightness(1.03);
  }

  .ag-btn--welcome:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    filter: brightness(0.94);
  }

  /* Focus (WCAG) */
  .ag-btn:focus-visible {
    outline: 2px solid var(--color-accent-primary, #FF7957);
    outline-offset: 2px;
  }

  /* Disabled */
  .ag-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    pointer-events: none;
  }
</style>

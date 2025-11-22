<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';

  export let id = '';
  export let value: string | number = '';
  export let placeholder = '';
  export let required = false;
  export let name = '';
  export let autocomplete: any = undefined;
  // Removida a prop 'type' não utilizada (para evitar o aviso do Svelte)

  const dispatch = createEventDispatcher();
  // Campo de senha começa oculto, toggle para mostrar
  let visible = false;
  $: inputType = visible ? 'text' : 'password';

  function onInput(e: Event) {
    const t = e.target as HTMLInputElement;
    value = t.value;
    // Dispara o evento de input (necessário para bind:value do componente pai)
    dispatch('input', { value });
  }

  function toggle() {
    visible = !visible;
  }
</script>

<label for={id} class="ag-input__label">
    <slot name="label" />
</label>

<div class="ag-input--password">
  <input
    id={id}
    name={name}
    class="ag-input"
    type={inputType}
    on:input={onInput}
    {placeholder}
    {required}
  bind:value
  autocomplete={/** @type {any} */ autocomplete}
  />
  <button type="button" class="pw-toggle" on:click={toggle} aria-pressed={visible} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}>
    {#if visible}
      <Icon icon="mdi:eye-off" width="18" height="18" color="currentColor" aria-hidden="true" />
    {:else}
      <Icon icon="mdi:eye" width="18" height="18" color="currentColor" aria-hidden="true" />
    {/if}
  </button>
</div>

<style>
  /* --- Layout do Container --- */
  .ag-input--password { 
    position: relative; 
    display: flex; 
    align-items: center; 
  }

  /* --- Estilo do Rótulo --- */
  .ag-input__label { 
  display: block; 
  font-size: var(--font-size-sm, .9rem); 
  margin-bottom: .25rem; 
  color: var(--component-input-placeholder, var(--color-text-muted, rgba(44,44,44,0.35))); 
  font-weight: var(--font-weight-medium, 500);
  }

  /* --- Estilo do Input --- */
  .ag-input { 
    width: 100%; 
    padding: 0 0.9rem; 
  height: var(--component-button-min-height, 48px);
  border-radius: var(--component-input-radius, 14px);
  border: 1.5px solid var(--component-input-border, var(--color-border-light, rgba(255,255,255,0.06)));
  background: var(--component-input-bg, rgba(255,255,255,0.03)); 
  color: var(--component-input-text, var(--color-text-primary, #E6EEF8)); 
    -webkit-appearance: none; 
    -moz-appearance: none; 
    appearance: none;
    box-sizing: border-box;
    padding-right: 48px; /* space for toggle */
  }

  /* botão toggle */
  .pw-toggle {
    position: absolute;
    right: 8px;
    background: transparent;
    border: 0;
  width: 40px;
  height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  /* use token de ícone/texto secundário por padrão */
  color: var(--component-icon-color, var(--color-text-secondary, rgba(44,44,44,0.35)));
  }

  /* Guarantee icon visibility in dark cards */
  :global(.card-ui) .pw-toggle {
    color: var(--text-on-dark, rgba(255,255,255,0.92));
  }

  /* Estado ativo: quando a senha está visível */
  .pw-toggle[aria-pressed="true"] {
    color: var(--component-icon-color-active, var(--color-accent-400));
  }

  .pw-toggle:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(38,108,255,0.12);
    border-radius: 8px;
  }

  /* Opcional: Adicionar um efeito visual ao focar o input */
  .ag-input:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(52,211,153,0.12); /* verde ManifestoUX */
  }
</style>
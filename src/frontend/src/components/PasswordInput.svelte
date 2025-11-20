<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let id = '';
  export let value: string | number = '';
  export let placeholder = '';
  export let required = false;
  export let name = '';
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
  />
  <button type="button" class="pw-toggle" on:click={toggle} aria-pressed={visible} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}>
    {#if visible}
      <!-- eye-off icon -->
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.25-3.26 3.7-5.78 6.53-6.93" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    {:else}
      <!-- eye icon -->
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3"/></svg>
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
  color: var(--component-input-placeholder, rgba(255,255,255,0.85)); 
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
    color: var(--color-muted, rgba(255,255,255,0.6));
  }

  /* Opcional: Adicionar um efeito visual ao focar o input */
  .ag-input:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(52,211,153,0.12); /* verde ManifestoUX */
  }
</style>
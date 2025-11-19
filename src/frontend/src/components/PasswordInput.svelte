<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let id = '';
  export let value: string | number = '';
  export let placeholder = '';
  export let required = false;
  export let name = '';
  // Removida a prop 'type' não utilizada (para evitar o aviso do Svelte)

  const dispatch = createEventDispatcher();
  // Campo de senha sempre oculto
  const inputType = 'password';

  function onInput(e: Event) {
    const t = e.target as HTMLInputElement;
    value = t.value;
    // Dispara o evento de input (necessário para bind:value do componente pai)
    dispatch('input', { value });
  }

  // toggle removido: senha sempre oculta
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
    font-size: .9rem; 
    margin-bottom: .25rem; 
    color: rgba(255,255,255,0.85); 
  }

  /* --- Estilo do Input --- */
  .ag-input { 
    width: 100%; 
    padding: .75rem .9rem; 
  padding-right: .9rem; 
  border-radius: 8px; 
  border: none; /* remover borda */
  background: rgba(255,255,255,0.03); 
    color: var(--text-on-dark); 
    -webkit-appearance: none; 
    -moz-appearance: none; 
    appearance: none;
  }

  /* botão de toggle removido (senha sempre oculta) */

  /* Opcional: Adicionar um efeito visual ao focar o input */
  .ag-input:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(52,211,153,0.12); /* verde ManifestoUX */
  }
</style>
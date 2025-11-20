<script lang="ts">
  export let id = '';
  export let type = 'text';
  export let value: string | number = '';
  export let placeholder = '';
  export let required = false;
  export let name = '';
</script>

<label for={id} class="ag-input__label"><slot name="label" /></label>
<input id={id} name={name} class="ag-input" {type} bind:value {placeholder} {required} />

<style>
  .ag-input {
  width: 100%;
  padding: 0 var(--component-button-padding-x, 1rem);
  height: var(--component-button-min-height, 48px);
  display: inline-flex;
  align-items: center;
  border-radius: var(--component-input-radius, 14px);
  border: 1.5px solid var(--color-border-light, var(--color-border-light, rgba(255,255,255,0.06)));
  background: var(--color-surface, var(--component-input-bg, rgba(255,255,255,0.03)));
  color: var(--color-text, var(--component-input-text, var(--color-text-primary, #E6EEF8)));
    box-sizing: border-box;
    font-family: var(--font-family-base, Inter), sans-serif;
    font-size: var(--font-size-md, 1rem);
  }

  .ag-input__label {
    display: block;
    font-size: var(--font-size-sm, 0.875rem);
    margin-bottom: 0.5rem;
    color: var(--component-input-placeholder, var(--color-text-muted, rgba(44,44,44,0.35)));
    font-weight: var(--font-weight-medium, 500);
  }

  input::placeholder { color: var(--component-input-placeholder, var(--color-text-muted, rgba(44,44,44,0.35))); }

  /* basic autofill reset attempts */
  input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus { box-shadow:0 0 0 30px rgba(255,255,255,0.01) inset !important; -webkit-box-shadow:0 0 0 30px rgba(255,255,255,0.01) inset !important; }
</style>

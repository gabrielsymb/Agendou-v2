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
  .ag-input { width:100%; padding:.75rem .9rem; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.03); color:var(--text-on-dark); }
  .ag-input__label { display:block; font-size:.9rem; margin-bottom:.25rem; color:rgba(255,255,255,0.85); }
  /* basic autofill reset attempts */
  input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus { box-shadow:0 0 0 30px rgba(255,255,255,0.01) inset !important; -webkit-box-shadow:0 0 0 30px rgba(255,255,255,0.01) inset !important; }
</style>

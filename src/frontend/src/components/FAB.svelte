<script lang="ts">
  export let onClick: () => void = () => {};
</script>

<button class="ag-fab" on:click={onClick} aria-label="Novo agendamento">+</button>

<style>
  .ag-fab { position:fixed; right:1rem; bottom:1.25rem; width:56px; height:56px; border-radius:50%; background:var(--color-accent-primary, #FF7957); color:var(--color-accent-contrast, #FFFFFF); font-size:28px; border:none; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 18px rgba(0,0,0,0.08); }
  .ag-fab:active { transform: scale(0.98); }
</style>

<script lang="ts">
  export let className = '';
</script>

<div class={`ag-card ${className}`} role="region">
  <slot />
</div>

<style>
  .ag-card { background:var(--agendou-card); color:var(--text-on-dark); border-radius:12px; padding:1rem; box-shadow:0 6px 18px rgba(0,0,0,0.35); }
</style>

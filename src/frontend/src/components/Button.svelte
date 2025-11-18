<script lang="ts">
  export let type: 'button'|'submit' = 'button';
  export let variant: 'primary'|'secondary'|'destructive' = 'primary';
  export let disabled = false;
  export let ariaLabel: string | undefined = undefined;
  // fallback label when none provided
  $: computedAria = ariaLabel || (typeof $$slots.default === 'function' ? undefined : undefined);
</script>

<button type={type} class={`ag-btn ag-btn--${variant}`} disabled={disabled} aria-label={ariaLabel}>
  <slot />
</button>

<style>
  .ag-btn { min-width:44px; min-height:44px; padding:.6rem .9rem; border-radius:10px; font-weight:600; border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
  .ag-btn--primary { background:var(--agendou-primary); color:#000; }
  .ag-btn--secondary { background:var(--agendou-secondary); color:var(--text-on-dark); }
  .ag-btn--destructive { background:#c0392b; color:#fff; }
</style>

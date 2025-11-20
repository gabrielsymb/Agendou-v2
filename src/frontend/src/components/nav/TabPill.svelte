<script lang="ts">
  export let className = '';
</script>

<div class={`tab-pill ${className}`} role="presentation">
  <slot />
</div>

<style>
  .tab-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--component-tabbar-pill-padding-y, 8px) var(--component-tabbar-pill-padding-x, 12px);
    border-radius: var(--component-tabbar-pill-radius, 9999px);
    background: var(--component-tabbar-pill-bg, rgba(0,0,0,0.04));
    color: var(--component-tabbar-pill-text-color, var(--color-text));
  }
</style>

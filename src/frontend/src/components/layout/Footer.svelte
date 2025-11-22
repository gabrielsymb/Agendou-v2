<script lang="ts">
  export let height = '64px';
</script>

<footer class="app-footer" style="height: {height};">
  <div class="inner">
    <slot>
      <!-- default footer content -->
      <div class="meta">&nbsp;</div>
    </slot>
  </div>
</footer>

<style>
  .app-footer {
    display: block;
    width: 100%;
    border-top: 1px solid var(--color-border, rgba(0,0,0,0.08));
    background: var(--color-surface, #FFFFFF);
    position: sticky;
    bottom: 0;
    z-index: calc(var(--z-nav, 20) + 3);
  }

  .app-footer .inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-4, 1rem);
  width: 100%;
  box-sizing: border-box;
  }

  .meta { color: var(--color-text-secondary, #6A6A6A); font-size: 0.9rem; }
</style>

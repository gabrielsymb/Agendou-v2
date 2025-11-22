<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  export let height = '56px';

  let el: HTMLElement | null = null;
  const varName = '--layout-header-height';
  let previous: string | null = null;
  let ro: ResizeObserver | null = null;
  let rafId: number | null = null;

  function updateRootHeight() {
    const h = el?.offsetHeight || parseInt(height, 10) || 56;
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.style.setProperty(varName, `${h}px`);
    }
  }

  onMount(() => {
    if (typeof document !== 'undefined' && document.documentElement) {
      previous = document.documentElement.style.getPropertyValue(varName) || null;
    }
  // First write immediately, then schedule a write in the next frame to ensure
  // the variable is present before the first paint in browsers that may defer
  // styles or when layout rounding happens.
  updateRootHeight();
  rafId = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(updateRootHeight) : null;
    if (typeof ResizeObserver !== 'undefined' && el) {
      ro = new ResizeObserver(updateRootHeight);
      ro.observe(el);
    }
    window.addEventListener('load', updateRootHeight);
  });

  onDestroy(() => {
    if (previous !== null && typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.style.setProperty(varName, previous);
    }
    if (ro) ro.disconnect();
  if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
    window.removeEventListener('load', updateRootHeight);
  });
</script>

<!-- Full-bleed header positioned above the layout content. Use --layout-header-height to sync spacing. -->
<header bind:this={el} class="app-header" style="height: {height}; --layout-header-height: {height};">
  <div class="inner">
    <slot>
      <!-- default header content: logo / title -->
      <div class="brand">Agendou</div>
    </slot>
  </div>
</header>

<style>
  .app-header {
    display: block;
    width: 100%;
    border-bottom: 1px solid var(--color-border, rgba(0,0,0,0.08));
    background: var(--color-surface, #FFFFFF);
  /* fixed so header remains visible at top; layout container will add padding-top to push content below */
  position: fixed;
  left: 0;
  top: 0;
  /* ensure header sits above any DnD mirrors or floating elements */
  z-index: 9999;
  backdrop-filter: blur(4px);
  }

  /* Inner keeps horizontal padding but allows full-bleed header background
    while content is constrained and distributed. Use space-between to
    position brand at start and optional actions at end. */
  .app-header .inner {
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 12px;
   padding: 0 var(--space-4, 1rem);
   width: 100%;
   /* keep content visually constrained on large screens with an inner container
     consumers can add .container to slot content if they want strict max-width */
   box-sizing: border-box;
  }

  /* small visual tweak so the header always appears full-bleed while content inside can be constrained */
  .app-header::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: var(--color-border, rgba(0,0,0,0.08));
    pointer-events: none;
  }

  .brand {
    font-weight: 600;
    color: var(--color-text-primary, #2C2C2C);
    font-size: 1rem;
  }

  /* Apply padding-top to the adjacent main only when header is present on the page.
     This avoids forcing top padding on routes that don't render the header (login, register, welcome). */
  :global(.app-header) + :global(main.bg-light) {
    padding-top: calc(var(--layout-header-height, 56px) + var(--layout-header-gap, 12px));
  }
</style>

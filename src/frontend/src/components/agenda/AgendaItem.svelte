<script lang="ts">
  import Icon from '@iconify/svelte';
  export let ag: any;
  export let isDragging: boolean = false;
  export let overId: string | number | null = null;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let rootEl: HTMLElement | null = null;
  let startX: number | null = null;
  let currentX = 0;
  const THRESHOLD = 0.25; // 25% of width

  function onPointerDown(e: PointerEvent) {
    startX = e.clientX;
    rootEl?.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (startX === null) return;
    currentX = e.clientX - startX;
    // apply transform for visual feedback
    if (rootEl) rootEl.style.transform = `translateX(${currentX}px)`;
  }

  function onPointerUp(e: PointerEvent) {
    if (startX === null) return;
    const width = rootEl?.offsetWidth || 1;
    const ratio = Math.abs(currentX) / width;
    // reset transform
    if (rootEl) {
      rootEl.style.transform = '';
      try { rootEl.releasePointerCapture?.(e.pointerId); } catch (err) { /* ignore */ }
    }
    if (ratio >= THRESHOLD) {
      try { navigator.vibrate?.(30); } catch (err) {}
      if (currentX > 0) {
        // swipe right -> conclude
        dispatch('conclude', { id: ag.id });
      } else {
        // swipe left -> cancel
        dispatch('cancel', { id: ag.id });
      }
    }
    startX = null;
    currentX = 0;
  }
</script>

<div bind:this={rootEl} on:pointerdown={onPointerDown} on:pointermove={onPointerMove} on:pointerup={onPointerUp} class="agenda-item" role="article" aria-roledescription="appointment" data-over-id={overId} class:dragging={isDragging} class:is-swiping={startX !== null}>
  <div class="content">
    <div class="title">{ag.clienteNome}</div>
    <div class="subtitle">{new Date(ag.dataHoraInicio).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} • {ag.servicoNome}</div>
  </div>
  <div class="status">
    <!-- placeholder badge -->
    <span class="badge">{ag.status ?? 'Agendado'}</span>
  </div>
  <!-- swipe action indicators -->
  <div class="swipe-left" aria-hidden={true}>
    <Icon icon="mdi:close" width="18" height="18" />
  </div>
  <div class="swipe-right" aria-hidden={true}>
    <Icon icon="mdi:check" width="18" height="18" />
  </div>
</div>

<style>
  .agenda-item {
    min-height: 64px;
    padding: var(--component-card-padding, 16px);
    background: var(--component-card-bg, var(--color-surface));
    border-radius: var(--component-card-radius, 12px);
    box-shadow: var(--component-card-shadow, 0 1px 3px rgba(0,0,0,0.03));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .agenda-item.dragging {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: 40;
  }
  .agenda-item::after {
    /* placeholder when overId is set on parent list - visual handled at list level */
    content: '';
  }
  .swipe-left, .swipe-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    opacity: 0;
    transition: opacity .12s ease, transform .12s ease;
    pointer-events: none;
  }
  .swipe-left { left: 8px; color: var(--color-danger, #e11d48); }
  .swipe-right { right: 8px; color: var(--color-success, #10b981); }
  .agenda-item.is-swiping .swipe-left,
  .agenda-item.is-swiping .swipe-right {
    opacity: 1;
  }
  .title { font-weight: 500; font-size: var(--font-size-md, 1rem); color: var(--color-text-primary); }
  .subtitle { font-size: var(--font-size-sm, .875rem); color: var(--color-text-secondary); }
  .badge { background: var(--component-badge-bg, var(--color-neutral-050)); padding: 6px 8px; border-radius: var(--radius-pill, 9999px); font-size: .75rem }
</style>

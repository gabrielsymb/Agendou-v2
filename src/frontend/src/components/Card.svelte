<script lang="ts">
  // Permite que o componente pai adicione classes específicas (como 'auth-panel')
  export let className = ''; 
</script>

<div {...$$restProps} class={`ag-card ${className}`} role="region">
  <slot />
</div>

<style>
  .ag-card {
    /* Regras neutras: OBRIGATÓRIAS para qualquer Card */
    width: auto; /* O Card deve se adaptar ao conteúdo por padrão */
    box-sizing: border-box; /* Fundamental para padding não somar na largura */

    /* Design system tokens (light surface) */
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #2C2C2C);
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 1rem);
    box-shadow: 0 -1px 6px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);

    /* Largura e centralização compatíveis com telas móveis */
    max-width: clamp(320px, 90vw, calc(100vw - var(--ag-card-edge-gap, 32px)));
    margin: 0.75rem auto;
  }

  /* Transições sutis para micro-interações */
  .ag-card { transition: transform 0.18s cubic-bezier(0.16,1,0.3,1), box-shadow 0.18s ease, background-color 0.2s ease, color 0.2s ease; }
</style>
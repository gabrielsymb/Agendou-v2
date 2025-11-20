<script lang="ts">
  // Permite que o componente pai adicione classes específicas (como 'auth-panel')
  export let className = ''; 
</script>

<div class={`ag-card ${className}`} role="region">
  <slot />
</div>

<style>
  .ag-card {
    /* Regras neutras: OBRIGATÓRIAS para qualquer Card */
    width: auto; /* O Card deve se adaptar ao conteúdo por padrão */
    box-sizing: border-box; /* Fundamental para padding não somar na largura */
    
    background: var(--agendou-card);
    color: var(--color-text-inverse, #ffffff);
  border-radius: var(--radius-lg, 16px);
  padding: var(--spacing-4, 1rem);
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.12));

    /* Regra padrão de largura do Card (herdada do projeto original):
       Adapta-se ao conteúdo, mas garante um mínimo de 360px */
    max-width: clamp(360px, 90vw, calc(100vw - var(--ag-card-edge-gap, 32px)));
    margin: 1rem auto; /* Centralização padrão */
  }

  /* No hover lift on base Card: structural component only */
  .ag-card { transition: none; transform: none; }
</style>
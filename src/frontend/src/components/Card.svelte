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
    color: var(--text-on-dark);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35);

    /* Regra padrão de largura do Card (herdada do projeto original):
       Adapta-se ao conteúdo, mas garante um mínimo de 360px */
    max-width: clamp(360px, 90vw, calc(100vw - var(--ag-card-edge-gap, 32px)));
    margin: 1rem auto; /* Centralização padrão */
  }
</style>
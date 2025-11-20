<script lang="ts">
  import Button from '../components/Button.svelte';
  import { navigate } from '../lib/router';
  import Logo from '../components/Logo.svelte';
  import Card from '../components/Card.svelte';
</script>

<section class="welcome" role="main" aria-labelledby="welcome-title">
  <Card class="welcome-panel">
    <div class="logo-wrap">
      <Logo size={96} />
    </div>

    <h1 id="welcome-title" class="title">Agendou!</h1>
    <p class="subtitle">Faça agendamentos rápidos e fáceis. Clicou... Agendou!</p>

  <div class="actions">
      <div class="primary-action">
        <Button variant="welcome" on:click={() => navigate('/login')}>Entrar</Button>
      </div>
      <div class="secondary-action">
        <Button variant="register" on:click={() => navigate('/register')}>Cadastrar</Button>
      </div>
    </div>
  </Card>
</section>

<style>
  /* Idealmente estas regras estariam em um arquivo CSS global ou App.svelte */
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow-x: hidden; 
  }
  
  .welcome {
    /* Propriedades para cobrir 100% da viewport e Centralizar */
    min-height: 100vh;
    display: flex;
    align-items: center; /* CHAVE: Centralização vertical */
    justify-content: center; /* CHAVE: Centralização horizontal */
    
  padding: 24px 0; /* remove lateral padding on mobile to prevent card shift */
    background: var(--color-bg);
    color: var(--color-text);
    box-sizing: border-box; /* Adicionado para garantir que padding não cause overflow */
    overflow-x: hidden; 
  }

  .logo-wrap { display:flex; justify-content:center; margin-bottom:14px; }

  /* --- Estilo do Card (ESPECÍFICO para Welcome) --- */
  :global(.ag-card.welcome-panel) {
    /* Centralização garantida */
    margin: 0 auto !important; 
    
    /* Regras de largura desejadas para esta tela */
    width: 100%;
    max-width: 500px; 
    min-width: 320px;
    
  box-sizing: border-box;
    text-align: center;
    padding: 28px;
    transition: height 0.3s ease-in-out, max-height 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }

  .title { margin: 0; font-size: 1.25rem; font-weight: 600; letter-spacing: 0.2px; color: var(--color-text); }
  .subtitle { margin: 8px 0 20px; color: var(--color-text-secondary) !important; font-size: 1rem; line-height:1.35; opacity:1 !important; visibility:visible !important; }
  .actions { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; align-items: stretch; }

  .primary-action { display: block; }
  .secondary-action { display: block; }

  @media (min-width: 600px) {
    .actions { flex-direction: row; justify-content: center; gap: 16px; }
    .primary-action { flex: 0 0 auto; }
    .secondary-action { flex: 0 0 auto; }
  }

  @media (min-width: 900px) {
    :global(.ag-card.welcome-panel) {
      padding: 48px;
      max-width: 600px; 
      min-width: 400px; 
    }
    .title { font-size: 2.4rem; }
    .subtitle { font-size: 1.1rem; }
  }
</style>
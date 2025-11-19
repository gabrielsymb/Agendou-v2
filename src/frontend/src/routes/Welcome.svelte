<script lang="ts">
  import ButtonPrimary from '../lib/components/shared/ButtonPrimary.svelte';
  import { navigate } from '../lib/router';
  import Logo from '../components/Logo.svelte';
  import Card from '../components/Card.svelte';
</script>

<section class="welcome" role="main" aria-labelledby="welcome-title">
  <Card className="welcome-panel">
    <div class="logo-wrap" style="display:flex;justify-content:center;margin-bottom:14px;">
      <Logo size={96} />
    </div>

    <h1 id="welcome-title" class="title">Agendou!</h1>
    <p class="subtitle">Faça agendamentos. 
    Clicou... Agendou!</p>

    <div class="actions">
      <ButtonPrimary on:click={() => navigate('/login')}>Entrar</ButtonPrimary>
      <ButtonPrimary variant="register" on:click={() => navigate('/register')}>Cadastrar</ButtonPrimary>
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
    
    padding: 24px;
    background: #121212;
    color: #fff;
    box-sizing: border-box; /* Adicionado para garantir que padding não cause overflow */
    overflow-x: hidden; 
  }

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

  .title { margin: 0; font-size: 1.8rem; letter-spacing: 0.2px; color: #fff; }
  .subtitle { margin: 8px 0 20px; color: #b3b3b3; font-size: 0.95rem; }
  .actions { display: grid; gap: 10px; margin-top: 6px; }

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
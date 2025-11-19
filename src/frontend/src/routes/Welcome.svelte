<script lang="ts">
  import ButtonPrimary from '../lib/components/shared/ButtonPrimary.svelte';
  import { navigate } from '../lib/router';
  import Logo from '../components/Logo.svelte';
</script>

<section class="welcome" role="main" aria-labelledby="welcome-title">
  <div class="panel">
    <div class="logo-wrap" style="display:flex;justify-content:center;margin-bottom:14px;">
      <Logo size={96} />
    </div>

    <h1 id="welcome-title" class="title">Agendou!</h1>
    <p class="subtitle">Faça agendamentos de forma rápida e com poucos cliques!</p>

    <div class="actions">
      <ButtonPrimary on:click={() => navigate('/login')}>Entrar</ButtonPrimary>
      <ButtonPrimary variant="register" on:click={() => navigate('/register')}>Cadastrar</ButtonPrimary>
    </div>
  </div>
</section>

<style>
  :global(html,body) {
    height: 100%;
  }

  .welcome {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #121212; /* dark default */
    color: #fff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .panel {
    width: 100%;
    max-width: 420px;
    text-align: center;
    padding: 28px;
    border-radius: 12px;
    /* leve elevação sutil sobre o fundo escuro */
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    box-shadow: 0 6px 18px rgba(0,0,0,0.6);
  }

  .title {
    margin: 0;
    font-size: 1.8rem;
    letter-spacing: 0.2px;
    color: #fff;
  }

  .subtitle {
    margin: 8px 0 20px;
    color: #b3b3b3;
    font-size: 0.95rem;
  }

  .actions {
    display: grid;
    gap: 10px;
    margin-top: 6px;
  }

  /* Desktop: centragem com mais espaço */
  @media (min-width: 900px) {
    .panel {
      padding: 40px;
    }
    .title { font-size: 2.2rem; }
    .subtitle { font-size: 1rem; }
  }
</style>

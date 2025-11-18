<script lang="ts">
  import Card from '../components/Card.svelte';
  import Button from '../components/Button.svelte';

  function navigate(path: string){ history.pushState({}, '', path); dispatchEvent(new Event('popstate')); }
</script>

<div class="container-mobile">
  <Card>
    <h1 style="font-size:28px;margin:0 0 .5rem;">Agendou</h1>
    <p style="color:rgba(255,255,255,0.8);margin:0 0 1rem;">Bem-vindo</p>
    <div style="display:flex;gap:.5rem;">
  <Button ariaLabel="Entrar" on:click={() => navigate('/login')}>Entrar</Button>
  <Button ariaLabel="Criar conta" variant="secondary" on:click={() => navigate('/register')}>Criar conta</Button>
    </div>
  </Card>
</div>

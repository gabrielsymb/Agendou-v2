<script lang="ts">
  import Card from '../components/Card.svelte';
  import Input from '../components/Input.svelte';
  import PasswordInput from '../components/PasswordInput.svelte';
  import Button from '../components/Button.svelte';
  import { navigate } from '../lib/router';
  import { toasts } from '../stores/toast';
  import { auth } from '../lib/stores/auth';
  import Section from '../components/layout/Section.svelte';

  let email = '';
  let senha = '';
  let loading = false;
  let errorMsg = '';
  let successMsg = '';

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMsg = '';
    successMsg = '';

    if (!email || !email.includes('@')) {
      errorMsg = 'Informe um e‑mail válido.';
      toasts.add(errorMsg, 'error');
      return;
    }
    if (!senha || senha.length < 6) {
      errorMsg = 'Senha inválida.';
      toasts.add(errorMsg, 'error');
      return;
    }

    loading = true;
    try {
      await auth.login(email, senha);
      // auth.setSession already emits a toast (showToast). Avoid double toast here.
      successMsg = 'Login efetuado';
      setTimeout(() => navigate('/home'), 300);
    } catch (err: any) {
      const msg = err?.message ?? 'Erro ao conectar com o servidor.';
      toasts.add(msg, 'error');
      errorMsg = msg;
    } finally {
      loading = false;
    }
  }
</script>

<Section padded>
  <div class="container-auth">
    <Card className="auth-panel">
    <h2 class="auth-title">Entrar</h2>
    
    <form on:submit|preventDefault={handleSubmit} style="display:flex;flex-direction:column;gap:.75rem;">
      <Input id="email" type="email" bind:value={email}><span slot="label">E-mail</span></Input>
      <PasswordInput id="senha" bind:value={senha}><span slot="label">Senha</span></PasswordInput>

      <div style="margin-top:12px">
        <Button type="submit" loading={loading} disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
      </div>

      {#if errorMsg}
        <div class="message-error">{errorMsg}</div>
      {/if}
      {#if successMsg}
        <div class="message-success">{successMsg}</div>
      {/if}
    </form>
    
    <div style="margin-top: 1rem; font-size: 0.9rem; color: #b3b3b3; text-align: center;">
       Não tem conta? 
       <a href="/register" on:click|preventDefault={() => navigate('/register')} style="color: var(--primary-color, #4facfe);">Cadastre-se</a>
    </div>
    </Card>
  </div>
</Section>

<style>
  /* --- Estilos do Container para Centralização --- */
  .container-auth {
    min-height: 100vh;
    display: flex;
    align-items: center; 
    justify-content: center; 
  padding: 24px 0; /* remove lateral padding to avoid pushing cards on small screens */
    background: #121212;
    box-sizing: border-box;
    /* FIX: Impedir overflow horizontal */
    overflow-x: hidden; 
  }

  /* --- Estilos do Card (Largura Fixa) --- */
  :global(.ag-card.auth-panel) {
    display: block !important;
    width: 100% !important;
    max-width: 500px !important; 
    /* Mínimo seguro para evitar overflow em pequenos celulares (pode ser 300px) */
    min-width: 320px !important; 
  margin: 0 auto; /* Reforça a centralização */
  box-sizing: border-box;
    padding: 28px;
    text-align: center;
    /* Transição para fluidez */
    transition: height 0.3s ease-in-out, max-height 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  
  /* Resolvendo o aviso 'Unused CSS selector' do h2 */
  .auth-title {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #fff;
  }

  /* Resolvendo os avisos 'Unused CSS selector' de mensagens */
  .message-error { 
    color: #ffb4b4; 
    font-size: 13px; 
    margin-top: 8px; 
  }
  
  .message-success { 
    color: #a7f3d0; 
    font-size: 13px; 
    margin-top: 8px; 
  }

  /* --- Media Query para Desktop --- */
  @media (min-width: 900px) {
    :global(.ag-card.auth-panel) {
      padding: 48px;
      max-width: 550px !important;
      min-width: 400px !important;
    }
  }
</style>
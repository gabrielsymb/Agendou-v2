<script lang="ts">
  import Card from '../components/Card.svelte';
  import Input from '../components/Input.svelte';
  import PasswordInput from '../components/PasswordInput.svelte';
  import Button from '../components/Button.svelte';
  import { navigate } from '../lib/router';
  import { toasts } from '../stores/toast';
  import { auth } from '../lib/stores/auth';
  // Section component removed: layout handled globally

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

  <div class="container-auth">
    <Card class="auth-panel">
    <h2 class="auth-title">Entrar</h2>
    
    <form on:submit|preventDefault={handleSubmit} style="display:flex;flex-direction:column;gap:.75rem;">
  <Input id="email" name="email" type="email" bind:value={email} autocomplete="email"><span slot="label">E-mail</span></Input>
  <PasswordInput id="senha" name="password" bind:value={senha} autocomplete="current-password"><span slot="label">Senha</span></PasswordInput>

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
    
  <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--color-text-secondary); text-align: center;">
       Não tem conta? 
     <a href="/register" on:click|preventDefault={() => navigate('/register')} style="color: var(--color-accent-primary);">Cadastre-se</a>
    </div>
    </Card>
  </div>

<style>
  /* Keep page-specific typography & message styles; layout (container, card) is globalized in global.css */
  .auth-title {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: var(--color-text);
  }

  .message-error {
    color: #ff6b6b;
    font-size: 13px;
    margin-top: 0.5rem;
    background: rgba(255, 107, 107, 0.06);
    padding: 8px;
    border-radius: 4px;
  }

  .message-success {
    font-size: 13px;
    color: #51cf66;
    margin-top: 0.5rem;
  }
</style>
<script lang="ts">
  import Card from '../components/Card.svelte';
  import Input from '../components/Input.svelte';
  // Alterei de 'Input' para 'PasswordInput' onde necessário
  import PasswordInput from '../components/PasswordInput.svelte';
  import Button from '../components/Button.svelte';
  import { navigate } from '../lib/router';

  let nome = '';
  let email = '';
  let senha = '';
  let loading = false;
  let errorMsg = '';
  let successMsg = '';

  /**
   * Lógica de submissão do formulário de cadastro.
   * Valida os campos e envia os dados para a API.
   */
  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMsg = '';
    successMsg = '';

    // Validações básicas do frontend
    if (!nome || nome.trim().length < 3) return (errorMsg = 'Nome precisa ter ao menos 3 caracteres.');
    if (!email || !email.includes('@')) return (errorMsg = 'Email inválido.');
    if (!senha || senha.length < 6) return (errorMsg = 'Senha precisa ter ao menos 6 caracteres.');

    loading = true;
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      // Se a API retornar JSON, tente parsear (mesmo em caso de erro)
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Tratamento de erros detalhado (ex: email duplicado)
        if (data?.errors && Array.isArray(data.errors)) {
          errorMsg = data.errors.map((it: any) => it.message || JSON.stringify(it)).join('; ');
        } else if (data?.message) {
          errorMsg = data.message;
        } else {
          errorMsg = `Erro: ${res.status} ${res.statusText}`;
        }
        return;
      }

      // Sucesso
      successMsg = data?.message || 'Conta criada com sucesso!';
      // Redireciona para o login após um pequeno atraso
      setTimeout(() => navigate('/login'), 700);
    } catch (err: any) {
      errorMsg = err?.message ?? 'Erro ao conectar com o servidor.';
    } finally {
      loading = false;
    }
  }
</script>

  <div class="container-auth">
    <Card class="auth-panel">
    <h2 class="auth-title">Criar conta</h2>
    
    <form on:submit|preventDefault={handleSubmit} style="display:flex;flex-direction:column;gap:.75rem;">
  <Input id="nome" name="nome" bind:value={nome}><span slot="label">Nome</span></Input>
  <Input id="email" name="email" type="email" bind:value={email} autocomplete="email"><span slot="label">E-mail</span></Input>
  <PasswordInput id="senha" name="password" bind:value={senha} autocomplete="new-password"><span slot="label">Senha</span></PasswordInput>
      
      <Button type="submit" ariaLabel="Criar conta" loading={loading} disabled={loading}>
        {loading ? 'Criando...' : 'Criar conta'}
      </Button>

      {#if errorMsg}<div class="message-error">{errorMsg}</div>{/if}
      {#if successMsg}<div class="message-success">{successMsg}</div>{/if}
    </form>
    
  <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--color-text-secondary); text-align: center;">
       Já tem conta? 
     <a href="/login" on:click|preventDefault={() => navigate('/login')} style="color: var(--color-accent-primary);">Entrar</a>
    </div>
    </Card>
  </div>

<style>
  /* Keep page-level typography and message styles; layout centralization is global */
  .auth-title {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: var(--color-text);
  }

  .message-error {
    font-size: 13px;
    color: #ff6b6b;
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

  @media (min-width: 900px) {
    :global(.ag-card.auth-panel) {
      padding: 48px;
      max-width: 550px !important;
      min-width: 400px !important;
    }
  }
</style>
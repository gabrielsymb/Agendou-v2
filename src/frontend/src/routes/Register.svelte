<script lang="ts">
  import Card from '../components/Card.svelte';
  import Input from '../components/Input.svelte';
  import Button from '../components/Button.svelte';
</script>

<div class="container-mobile">
  <Card>
    <h2>Criar conta</h2>
    <form style="display:flex;flex-direction:column;gap:.75rem;">
      <Input id="nome"><span slot="label">Nome</span></Input>
      <Input id="email" type="email"><span slot="label">E-mail</span></Input>
      <Input id="senha" type="password"><span slot="label">Senha</span></Input>
  <Button type="submit" ariaLabel="Criar conta">Criar conta</Button>
    </form>
  </Card>
</div>

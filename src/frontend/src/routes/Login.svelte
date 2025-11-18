<script lang="ts">
  import Card from '../components/Card.svelte';
  import Input from '../components/Input.svelte';
  import Button from '../components/Button.svelte';
  import { auth } from '../../src/lib/stores/auth';
</script>

<div class="container-mobile">
  <Card>
    <h2>Entrar</h2>
    <form style="display:flex;flex-direction:column;gap:.75rem;">
      <Input id="email" type="email"><span slot="label">E-mail</span></Input>
      <Input id="senha" type="password"><span slot="label">Senha</span></Input>
  <Button type="submit" ariaLabel="Entrar no aplicativo">Entrar</Button>
    </form>
  </Card>
</div>

<script lang="ts">
  import Section from '../components/layout/Section.svelte';
  import Button from '../components/Button.svelte';
  let clientes = [
    { id: 1, nome: 'Ana Silva' },
    { id: 2, nome: 'João Pereira' },
    { id: 3, nome: 'Maria Costa' }
  ];
</script>

<Section padded>
  <h2>Clientes</h2>
  <div class="list">
    {#each clientes as c}
      <div class="cliente-card">{c.nome}</div>
    {/each}
  </div>
  <div class="actions">
    <Button>Adicionar cliente</Button>
  </div>
</Section>

<style>
  h2 { margin-bottom: 12px }
  .list { display:flex; flex-direction:column; gap:10px }
  .cliente-card { padding:12px; background:var(--color-surface); border-radius:8px; box-shadow: var(--component-card-shadow); }
  .actions { margin-top: 16px }
</style>

<script lang="ts">
  import Section from '../components/layout/Section.svelte';
  import Card from '../components/Card.svelte';
</script>

<Section padded>
  <div style="max-width:720px;margin:0 auto">
    <Card>
      <h2>Configurações</h2>
      <p style="color:var(--color-text);">Personalize a aparência do app.</p>
  <!-- Theme control removed per design decision -->
    </Card>
  </div>
</Section>

<style>
  h2 { margin: 0 0 8px 0; }
</style>

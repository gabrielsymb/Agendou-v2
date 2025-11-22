<script lang="ts">
</script>

<!-- IGNORANDO estilos inline anteriores -->
<div style="background: rgba(255,0,0,0.2); padding:0; margin:0;">
  <p style="margin:0; padding:0;">
    TESTE
  </p>
</div>

<section style="padding: 1rem; max-width: 720px; margin: 0 auto;">
  <h1>Teste de Layout — Lorem Ipsum</h1>
  {#each Array(40) as _, i}
  
    <p>
      PARÁGRAFO {i}
    </p>
  {/each}
</section>

<style>
  h1 { margin-top: 0; }
</style>

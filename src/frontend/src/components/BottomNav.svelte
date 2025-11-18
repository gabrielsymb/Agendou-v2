<script lang="ts">
  // simple bottom nav
</script>

<nav class="ag-bottomnav">
  <div class="ag-bottomnav__item">Agenda</div>
  <div class="ag-bottomnav__item">Clientes</div>
  <div class="ag-bottomnav__item">Serviços</div>
  <div class="ag-bottomnav__item">Config</div>
</nav>

<style>
  .ag-bottomnav { position:fixed; left:0; right:0; bottom:0; height:56px; display:flex; background:var(--agendou-card); justify-content:space-around; align-items:center; box-shadow:0 -4px 12px rgba(0,0,0,0.3); }
  .ag-bottomnav__item { color:var(--text-on-dark); font-size:.9rem; }
</style>

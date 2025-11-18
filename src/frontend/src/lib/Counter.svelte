<script>
  let count = 0;
  const increment = () => { count += 1 };
</script>

<button on:click={increment} aria-label="Incrementar contador">count is {count}</button>

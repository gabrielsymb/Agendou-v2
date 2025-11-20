<script lang="ts">
  export let variant: string = 'body';

  function tag(v: string) {
    return ({
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      label: 'label',
      body: 'p'
    } as Record<string, string>)[v] || 'p';
  }
</script>

<svelte:element this={tag(variant)} class={variant}>
  <slot />
</svelte:element>

<style>
  h1 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  label {
    font-size: .875rem;
    font-weight: 600;
  }

  p,
  .body {
    font-size: 1rem;
    line-height: 1.55;
    font-weight: 400;
  }

  /* ensure typography uses Inter */
  :global(body), :global(html) { font-family: var(--font-family-base, Inter), sans-serif; }
</style>

<script>
  export let gap = 'var(--space-6)';
  export let padded = false;
</script>

<section
  style="
    padding: {padded ? 'var(--space-6) 0' : '0'};
    display: flex;
    flex-direction: column;
    gap: {gap};
  "
>
  <slot />
</section>

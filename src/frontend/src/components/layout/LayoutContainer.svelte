<script>
  export let padded = true;
  export let max = true;
</script>

<div
  class="layout-container"
  style="
    padding-inline: {padded ? 'var(--container-padding)' : '0'};
    max-width: {max ? 'var(--container-max)' : 'none'};
    margin-inline: auto;
  "
>
  <slot />
</div>

<style>
  .layout-container {
    width: 100%;
    display: block;
  }
</style>

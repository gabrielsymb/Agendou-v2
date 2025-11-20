<script lang="ts">
  import SpinnerLib from '../lib/components/Loader/Spinner.svelte';
  export let size = 24;
  export let color: string | undefined = undefined;
  export let stroke: number | undefined = undefined;
  $: spinnerProps = { size } as Record<string, any>;
  if (color !== undefined) spinnerProps.color = color;
  if (stroke !== undefined) spinnerProps.stroke = stroke;
</script>

<SpinnerLib {...spinnerProps} />

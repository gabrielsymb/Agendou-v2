<script lang="ts">
  import LibSpinner from '../lib/components/Loader/Spinner.svelte';
  export let size: number | string | undefined;
  export let stroke: number | string | undefined;
  export let color: string | undefined;

  // only pass props that are defined so lib defaults apply
  const props: Record<string, any> = {};
  if (size !== undefined) props.size = size;
  if (stroke !== undefined) props.stroke = stroke;
  if (color !== undefined) props.color = color;
</script>

<LibSpinner {...(props as any)} />

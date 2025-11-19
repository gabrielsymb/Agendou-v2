<script lang="ts">
  import Inner from '../../../components/Button.svelte';
  export let variant: 'primary' | 'register' = 'primary';

  // cores conforme ManifestoUX: verde como accent; azul para registro
  const greenBg = 'linear-gradient(90deg,#2dd4bf,#34d399)';
  const blueBg = 'linear-gradient(90deg,#3b82f6,#2563eb)';

  const bg = variant === 'register' ? blueBg : greenBg;
  const textColor = variant === 'register' ? '#ffffff' : '#071013';

  // usar any para forçar atributos extras (evita erro de tipagem do svelte-ts)
  const forcedAttrs: any = {
    class: `ag-btn ag-btn--${variant}`,
    style: `background: ${bg}; color: ${textColor};`
  };
</script>

<svelte:component this={Inner} {...$$restProps} {...forcedAttrs}>
  <slot />
</svelte:component>

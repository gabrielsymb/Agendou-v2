<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let variant: 'primary' | 'secondary' | 'destructive' | 'register' = 'primary';
  export let disabled: boolean = false;
  export let ariaLabel: string | undefined = undefined;
  // outros props serão encaminhados automaticamente via {...$$restProps}
</script>

<button
  type={type}
  class={`ag-btn ag-btn--${variant}`}
  aria-label={ariaLabel}
  disabled={disabled}
  {...$$restProps}
>
  <slot />
</button>

<style>
  .ag-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    box-sizing: border-box;
    text-align: center;
  }

  /* cores padrão conforme ManifestoUX */
  .ag-btn--primary {
    background: linear-gradient(90deg,#2dd4bf,#34d399);
    color: #071013;
  }

  .ag-btn--register {
    background: linear-gradient(90deg,#3b82f6,#2563eb);
    color: #ffffff;
  }

  .ag-btn--secondary {
    background: transparent;
    color: #e6e6e6;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .ag-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

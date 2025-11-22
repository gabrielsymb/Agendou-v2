<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();
  
  export let items: Array<{ id: string; label: string; icon?: string }> = [];
  export let activeIndex = 0;

  function onTap(i: number) {
    activeIndex = i;
    dispatch('tabtap', { index: i });
  }
</script>

<nav class="navigation">
  <ul class="nav-list" style="--active-index: {activeIndex}; --items-count: {items.length};">
    <div class="indicator">
      <div class="indicator-circle"></div>
    </div>
    
    {#each items as item, index}
      <li class="nav-item" class:active={index === activeIndex}>
        <button 
          class="nav-button" 
          on:click={() => onTap(index)} 
          aria-label={item.label}
          type="button"
        >
          <span class="icon">
            <Icon icon={item.icon ?? ''} width="24" height="24" />
          </span>
          <span class="text">{item.label}</span>
        </button>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px 20px 0 0;
    box-shadow: none;
    z-index: 1300;
  }

  /* Constrain navigation width on large screens to keep it centered (mobile-shaped) */
  @media (min-width: 480px) {
    .navigation {
      max-width: 420px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 16px 16px 0 0;
      box-shadow: 0 6px 18px rgba(16,24,40,0.06);
    }
  }

  .nav-list {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    justify-content: space-around;
    align-items: center;
  }

  .nav-item {
    position: relative;
    list-style: none;
    flex: 1;
    height: 100%;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav-button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  /* evita tap highlight em navegadores touch */
  .nav-button { -webkit-tap-highlight-color: transparent; }

  /* não remove outline globalmente — use focus-visible para teclado */
  .nav-button { outline: none; }

  /* mostrar indicador apenas para navegação por teclado */
  .nav-button:focus-visible {
    outline: 2px solid var(--agendou-primary, #FF7957);
    outline-offset: 4px;
    border-radius: 6px;
  }

  .icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), color 0.3s;
    color: #999;
    z-index: 3;
  }

  .nav-item.active .icon {
    transform: translateY(-28px);
    color: #fff;
  }

  .text {
    position: absolute;
    bottom: 20px;
    color: #999;
    font-weight: 500;
    font-size: 0.7em;
    letter-spacing: 0.05em;
    transition: opacity 0.3s, color 0.3s;
    opacity: 0;
    pointer-events: none;
  }

  .nav-item.active .text {
    opacity: 1;
    color: #FF7957;
  }

  /* Indicador com a bola laranja */
  .indicator {
    position: absolute;
    top: -27px;
    width: calc(100% / var(--items-count));
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: left 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    left: calc((100% / var(--items-count)) * var(--active-index));
    pointer-events: none;
    z-index: 1;
  }

  .indicator-circle {
    width: 42px;
    height: 42px;
    background: #FF7957;
    border-radius: 50%;
    border: 6px solid #F4F3F1;
    box-sizing: border-box;
    position: relative;
  }

  /* Curva esquerda (côncava) */
  .indicator-circle::before {
    content: '';
    position: absolute;
    top: 8px;
    left: -22px;
    width: 20px;
    height: 80px;
    background: transparent;
    border-top-right-radius: 22px;
    box-shadow: 0px -10px 0 0 #F4F3F1;
  }

  /* Curva direita (côncava) */
  .indicator-circle::after {
    content: '';
    position: absolute;
    top: 7px;
    right: -22px;
    width: 20px;
    height: 22px;
    background: transparent;
    border-top-left-radius: 22px;
    box-shadow: 0px -10px 0 0 #F4F3F1;
  }
</style>
1. CORE TOKENS (FOUNDATION LAYER)
-----------------------------------------------------------

Valores brutos — nunca usados diretamente nos componentes.
Baseados em evidências científicas sobre legibilidade, contraste e foco visual.

🎨 1.1. Cores — Neutros
--color-neutral-000: #FFFFFF;
--color-neutral-050: #F7F7F6;
--color-neutral-100: #F4F3F1;
--color-neutral-200: #E8E7E5;
--color-neutral-300: #D0CFCC;
--color-neutral-400: #B5B4B1;
--color-neutral-500: #8F8E8B;
--color-neutral-600: #6A6A6A;
--color-neutral-700: #4A4A4A;
--color-neutral-800: #2C2C2C;
--color-neutral-900: #1A1A1A;

🔥 1.2. Cores — Acento quente

Baseado em paletas contemporâneas de UI emocional (Norman, 2013).

--color-accent-300: #FF8A70;   /* Coral claro */
--color-accent-400: #FF7957;   /* Salmão suave */
--color-accent-500: #E46B4C;   /* Terracota moderna */

🌡️ 1.3. Feedback / Estado
--color-success-500: #2ECC71;
--color-warning-500: #F1C40F;
--color-danger-500: #E74C3C;
--color-info-500:    #3498DB;

✍️ 1.4. Tipografia – Fonte Inter

Valores que se alinham a estudos de legibilidade modernos.

--font-family-base: "Inter", sans-serif;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-md: 1rem;      /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */

📏 1.5. Espaçamento

Escala científica modular (4 / 8 / 12 / 16 / 20 / 24 / 32).

--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;

🟦 1.6. Raios (Bordas)

Inclui o “pill real”.

--radius-none: 0;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-pill: 9999px;

🌫️ 1.7. Sombras

Baseadas em estudos de profundidade perceptual.

--shadow-xs: 0 1px 2px rgba(0,0,0,0.08);
--shadow-sm: 0 2px 4px rgba(0,0,0,0.10);
--shadow-md: 0 4px 6px rgba(0,0,0,0.12);
--shadow-lg: 0 8px 12px rgba(0,0,0,0.14);

🕒 1.8. Tempos e Curvas

Essenciais para microinterações.

--duration-fast: 120ms;
--duration-base: 180ms;
--duration-slow: 260ms;

--easing-standard: cubic-bezier(0.25, 0.1, 0.25, 1);
--easing-emphasized: cubic-bezier(0.2, 0, 0, 1);

-----------------------------------------------------------
2. SEMANTIC TOKENS (THEME LAYER)
-----------------------------------------------------------

Aqui os valores ganham significado.
Esses tokens são globais e podem mudar o tema sem alterar componentes.

🎨 2.1. Fundo e Superfícies
--color-bg-primary: var(--color-neutral-100);
--color-bg-secondary: var(--color-neutral-000);
--color-surface: var(--color-neutral-000);
--color-surface-alt: var(--color-neutral-050);

✍️ 2.2. Texto
--color-text-primary: var(--color-neutral-800);
--color-text-secondary: var(--color-neutral-600);
--color-text-inverse: var(--color-neutral-000);
--color-text-accent: var(--color-accent-500);

🔥 2.3. Acentos (tema quente)
--color-accent: var(--color-accent-400);
--color-accent-strong: var(--color-accent-500);

🌡️ 2.4. Estado
--color-success: var(--color-success-500);
--color-warning: var(--color-warning-500);
--color-danger: var(--color-danger-500);
--color-info: var(--color-info-500);

-----------------------------------------------------------
3. COMPONENT TOKENS (NAMESPACES)
-----------------------------------------------------------

Cada componente tem seu espaço isolado.
Nenhum token daqui colide com outro.

⚫ 3.1. Buttons
--component-button-padding-y: var(--spacing-2);
--component-button-padding-x: var(--spacing-4);
--component-button-radius: var(--radius-md);

--component-button-bg-primary: var(--color-accent);
--component-button-bg-primary-hover: var(--color-accent-strong);
--component-button-text-primary: var(--color-text-inverse);

🔵 3.2. Cards
--component-card-padding: var(--spacing-4);
--component-card-radius: var(--radius-lg);
--component-card-shadow: var(--shadow-sm);
--component-card-bg: var(--color-surface);
--component-card-border: var(--color-neutral-200);

🟠 3.3. Swipe List (interações visuais)
--component-swipe-threshold: 64px;
--component-swipe-transition: var(--duration-base) var(--easing-standard);

--component-swipe-icon-size: 1.25rem;

--component-swipe-bg-left: var(--color-accent);
--component-swipe-bg-right: var(--color-danger);
--component-swipe-text-color: var(--color-text-inverse);

🟣 3.4. TabBar e Tab Pills

Comporta-se como um sistema conversando com o swipe.

--component-tabbar-height: 64px;
--component-tabbar-bg: var(--color-surface);
--component-tabbar-shadow: var(--shadow-xs);

/* Pill */
--component-tabbar-pill-padding-x: var(--spacing-3);
--component-tabbar-pill-padding-y: var(--spacing-2);
--component-tabbar-pill-radius: var(--radius-pill);

--component-tabbar-pill-bg: var(--color-neutral-200);
--component-tabbar-pill-bg-active: var(--color-accent);
--component-tabbar-pill-text-color: var(--color-text-primary);
--component-tabbar-pill-text-color-active: var(--color-text-inverse);

--component-tabbar-pill-transition: var(--duration-base) var(--easing-emphasized);

🟡 3.5. Icons (FontAwesome + Iconify)

Compatível com os dois pacotes que você já usa.

--component-icon-size-sm: 14px;
--component-icon-size-md: 18px;
--component-icon-size-lg: 24px;

--component-icon-color: var(--color-text-secondary);
--component-icon-color-active: var(--color-accent-strong);

🟫 3.6. Inputs
--component-input-padding: var(--spacing-3);
--component-input-radius: var(--radius-md);

--component-input-bg: var(--color-surface);
--component-input-border: var(--color-neutral-300);
--component-input-border-focus: var(--color-accent);
--component-input-text: var(--color-text-primary);
--component-input-placeholder: var(--color-text-secondary);

🟩 3.7. Modals
--component-modal-radius: var(--radius-xl);
--component-modal-bg: var(--color-surface);
--component-modal-shadow: var(--shadow-lg);
--component-modal-backdrop: rgba(0,0,0,0.45);

🟧 3.8. Avatars
--component-avatar-radius: var(--radius-pill);
--component-avatar-size-sm: 32px;
--component-avatar-size-md: 48px;
--component-avatar-size-lg: 64px;

✔️ 3.9. Badges / Tags
--component-badge-radius: var(--radius-pill);
--component-badge-padding-x: var(--spacing-2);
--component-badge-padding-y: 2px;

--component-badge-bg: var(--color-neutral-200);
--component-badge-bg-accent: var(--color-accent);
--component-badge-text-color: var(--color-text-primary);
--component-badge-text-color-accent: var(--color-text-inverse);
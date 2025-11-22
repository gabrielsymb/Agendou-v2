/// <reference types="vite/client" />

declare module 'svelte-spa-router' {
  const Router: any;
  export default Router;
}

// allow importing local JS re-exports (created to satisfy Node16 module resolution)
declare module '../services/api.js' {
  const api: any;
  export { api };
  export default api;
}

// also allow importing without .js extension in editor/LS
declare module '../services/api' {
  const api: any;
  export { api };
  export default api;
}

declare module '*.svelte' {
  import type { SvelteComponentTyped } from "svelte";
  export default class Component extends SvelteComponentTyped<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  > {}
}

// Vite / SvelteKit style `import.meta.env` typings used in the frontend
declare global {
  interface ImportMetaEnv {
    readonly MODE?: string;
    readonly DEV?: boolean;
    readonly PROD?: boolean;
    readonly VITE_DEBUG?: string;
    // add additional VITE_... vars here as needed, e.g.:
    // readonly VITE_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};

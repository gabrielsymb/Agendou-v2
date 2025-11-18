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

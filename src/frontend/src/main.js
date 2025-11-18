// early debug
console.log('[app] main module executing (early)')
import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app

// debug
console.log('[app] main mounted', document.getElementById('app'))

// compatibility wrapper for auth store (if some modules import from src/stores/auth.ts)
// Import the canonical implementation from lib and re-export it. Use explicit .js
// extension to satisfy Node16/Nodenext module resolution settings.
import Auth from '../lib/stores/auth.js';

export const auth = Auth;

export default auth;

/**
 * Single accessor for build-time environment configuration.
 *
 * Backed by Vite's import.meta.env (see frontend/.env.example). This is the
 * only place the app should read import.meta.env directly — everything
 * else imports from here, so the app never has a hard-coded domain in its
 * source (CLAUDE.md Section 23).
 */

/** The public URL this Nexcred frontend is served from, if configured. */
export const APP_URL: string = import.meta.env.VITE_APP_URL ?? ''

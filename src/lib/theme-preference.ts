/**
 * Shared between the proxy (cookie-based redirect for returning visitors)
 * and the floating theme toggle (which sets the cookie once a visitor makes
 * an explicit choice). One name, one shape, used from both a server context
 * (proxy.ts) and a client context (FloatingUtilityControls.tsx).
 */
export const THEME_PREFERENCE_COOKIE = "srs-theme";

export type ThemePreference = "dark" | "light";

/** One year — long enough to feel permanent, not so long it can never self-correct. */
export const THEME_PREFERENCE_MAX_AGE = 60 * 60 * 24 * 365;

export type ThemeChoice = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "srs-theme";

/** Runs before paint. Keep this in sync with ThemeProvider.apply. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k)||"system";if(s!=="light"&&s!=="dark"&&s!=="system")s="system";var dark=s==="dark"||(s==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",dark);r.dataset.theme=s;r.style.colorScheme=dark?"dark":"light";}catch(e){}})();`;

export function isThemeChoice(value: string | null): value is ThemeChoice {
  return value === "light" || value === "dark" || value === "system";
}

export function prefersDark(choice: ThemeChoice): boolean {
  if (choice === "dark") return true;
  if (choice === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyThemeChoice(choice: ThemeChoice): void {
  const dark = prefersDark(choice);
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.dataset.theme = choice;
  root.style.colorScheme = dark ? "dark" : "light";
}

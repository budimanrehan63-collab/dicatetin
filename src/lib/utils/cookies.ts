/**
 * Robust Client & Server Cookie Management for Dicatetin
 */

export function setAppCookie(name: string, value: string, days: number = 30) {
  if (typeof document === "undefined") return;

  const isProd = window.location.protocol === "https:";
  const secureFlag = isProd ? "; Secure" : "";
  const maxAge = 60 * 60 * 24 * days;

  // Set with maximum compatibility
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;

  try {
    localStorage.setItem(name, value);
  } catch (e) {
    // ignore
  }

  // Also notify server API in background to set HTTP headers
  if (name === "dicatetin_session" || name === "dicatetin_admin_session") {
    fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: value }),
    }).catch(() => {});
  }
}

export function getAppCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];

  try {
    return localStorage.getItem(name);
  } catch (e) {
    return null;
  }
}

export function clearAppCookie(name: string) {
  if (typeof document === "undefined") return;

  const isProd = window.location.protocol === "https:";
  const secureFlag = isProd ? "; Secure" : "";

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
  try {
    localStorage.removeItem(name);
  } catch (e) {
    // ignore
  }
}

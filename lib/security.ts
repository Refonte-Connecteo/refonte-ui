import DOMPurify from "dompurify";

const SAFE_HREF_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

const UNSAFE_URL_CHARS = /[\\\u0000-\u001F\u007F\u2028\u2029]/;

export function sanitizeHtml(dirtyHtml: string): string {
  if (typeof window === "undefined") return "";
  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true },
  });
}

export function sanitizeUrl(
  url: string | null | undefined,
  fallback = "#"
): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  const protocolMatch = /^([a-z][a-z0-9+.-]*):/i.exec(trimmed);
  if (protocolMatch) {
    const protocol = protocolMatch[1].toLowerCase();
    if (!SAFE_HREF_PROTOCOLS.has(protocol)) return fallback;
  }
  if (UNSAFE_URL_CHARS.test(trimmed)) return fallback;
  return trimmed;
}

export function getSafeRedirectUrl(
  url: string | null | undefined,
  fallbackRoute = "/"
): string {
  if (!url) return fallbackRoute;
  const trimmed = url.trim();
  if (!trimmed) return fallbackRoute;
  if (trimmed.startsWith("//")) return fallbackRoute;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return fallbackRoute;
  if (!trimmed.startsWith("/")) return fallbackRoute;
  if (UNSAFE_URL_CHARS.test(trimmed)) return fallbackRoute;
  return trimmed;
}

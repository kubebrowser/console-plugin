const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;

// Mirror browser address bars: assume http:// when no scheme is typed.
export function normalizeUrl(input: string): string {
  return SCHEME_PATTERN.test(input) ? input : `http://${input}`;
}

// The text for the address bar given the remote page's URL: blank for the empty page, and
// undefined (keep the field as it is) for browser-internal pages such as network error pages.
export function addressBarUrl(pageUrl: string): string | undefined {
  if (pageUrl === "about:blank") return "";
  return /^https?:\/\//i.test(pageUrl) ? pageUrl : undefined;
}

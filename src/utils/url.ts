const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;

// Mirror browser address bars: assume http:// when no scheme is typed.
export function normalizeUrl(input: string): string {
  return SCHEME_PATTERN.test(input) ? input : `http://${input}`;
}

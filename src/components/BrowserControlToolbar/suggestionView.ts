import {
  NamespaceSummary,
  ServiceSuggestion,
  filterSuggestions
} from "../../hooks/useServiceSuggestions";

const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;

export const MENU_ID = "browser-url-suggestions";
export const MAX_ROWS = 50;

// Values of the non-Service rows, so keyboard focus can move over them too.
export const TYPED_URL_ROW = "__typed-url__";
export const ALL_NAMESPACES_ROW = "__all-namespaces__";
export const SEARCH_ALL_ROW = "__search-all__";
export const NAMESPACE_ROW_PREFIX = "ns:";

// Mirror browser address bars: assume http:// when no scheme is typed.
export function normalizeUrl(input: string): string {
  return SCHEME_PATTERN.test(input) ? input : `http://${input}`;
}

export function optionId(value: string) {
  return `${MENU_ID}-${value.replace(/[^a-z0-9-]/gi, "-")}`;
}

export type SuggestionView = {
  query: string;
  // The namespace whose Services are listed; undefined means "All namespaces".
  namespace?: string;
  canListClusterWide: boolean;
  namespaces: NamespaceSummary[];
  services: ServiceSuggestion[];
  matchCount: number;
  offerSearchAll: boolean;
  // Values of every row the keyboard can reach, in the order they're rendered.
  rows: string[];
};

export function buildSuggestionView(args: {
  query: string;
  namespace?: string;
  canListClusterWide: boolean;
  suggestions: ServiceSuggestion[];
  namespaces: NamespaceSummary[];
}): SuggestionView {
  const { query, namespace, canListClusterWide } = args;
  const isAllNamespaces = !namespace;
  const matches = filterSuggestions(args.suggestions, query);
  // "All namespaces" with nothing typed lists namespaces; typing searches every Service.
  const namespaces = isAllNamespaces
    ? args.namespaces.filter((ns) => !query || ns.name.toLowerCase().includes(query.toLowerCase()))
    : [];
  const services = isAllNamespaces && !query ? [] : matches.slice(0, MAX_ROWS);
  const offerSearchAll = !isAllNamespaces && !!query && matches.length === 0 && canListClusterWide;
  const rows = [
    ...(query ? [TYPED_URL_ROW] : []),
    ...(!isAllNamespaces && canListClusterWide ? [ALL_NAMESPACES_ROW] : []),
    ...namespaces.map((ns) => NAMESPACE_ROW_PREFIX + ns.name),
    ...services.map((s) => s.id),
    ...(offerSearchAll ? [SEARCH_ALL_ROW] : [])
  ];
  return {
    query,
    namespace,
    canListClusterWide,
    namespaces,
    services,
    matchCount: matches.length,
    offerSearchAll,
    rows
  };
}

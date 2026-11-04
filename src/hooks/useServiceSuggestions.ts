import * as React from "react";
import {
  K8sResourceKind,
  useAccessReview,
  useK8sWatchResource
} from "@openshift-console/dynamic-plugin-sdk";
import { serviceGVK } from "../utils/gvk";

export type ServiceSuggestion = {
  id: string;
  namespace: string;
  name: string;
  port: number;
  portName?: string;
  scheme: "http" | "https";
  url: string;
  variant: "ClusterIP" | "Headless" | "ExternalName";
};

const HTTPS_PORTS = [443, 8443];
const TLS_NAME = /(^|[-_])(https|tls|ssl)($|[-_])/i;

// Pick https from appProtocol, the port name, or a well-known TLS port.
export function guessScheme(port: { port: number; name?: string; appProtocol?: string }) {
  if (port.appProtocol) return /https|tls/i.test(port.appProtocol) ? "https" : "http";
  if (port.name && TLS_NAME.test(port.name)) return "https";
  return HTTPS_PORTS.includes(port.port) ? "https" : "http";
}

export function toSuggestions(services: K8sResourceKind[]): ServiceSuggestion[] {
  return services.flatMap((svc) => {
    const name = svc.metadata?.name ?? "";
    const namespace = svc.metadata?.namespace ?? "";
    const isExternal = svc.spec?.type === "ExternalName";
    const variant = isExternal
      ? "ExternalName"
      : svc.spec?.clusterIP === "None"
        ? "Headless"
        : "ClusterIP";
    const host = isExternal ? svc.spec?.externalName : `${name}.${namespace}.svc`;
    const ports: { port: number; name?: string; appProtocol?: string; protocol?: string }[] =
      svc.spec?.ports ?? [];

    return ports
      .filter((p) => (p.protocol ?? "TCP") === "TCP")
      .map((p) => {
        const scheme = guessScheme(p);
        const isDefaultPort =
          (scheme === "http" && p.port === 80) || (scheme === "https" && p.port === 443);
        return {
          id: `${namespace}/${name}:${p.port}`,
          namespace,
          name,
          port: p.port,
          portName: p.name,
          scheme,
          url: `${scheme}://${host}${isDefaultPort ? "" : `:${p.port}`}`,
          variant
        };
      });
  });
}

// Match on the service name, "name.namespace", "namespace/name" or the URL itself,
// ignoring a typed scheme so "https://api" still finds api.
export function filterSuggestions(suggestions: ServiceSuggestion[], query: string) {
  const q = query
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "");
  if (!q) return suggestions;
  return suggestions.filter((s) =>
    [
      s.name,
      `${s.name}.${s.namespace}`,
      `${s.namespace}/${s.name}`,
      s.url.replace(/^[a-z]+:\/\//, "")
    ].some((field) => field.toLowerCase().includes(q))
  );
}

export type NamespaceSummary = { name: string; serviceCount: number };

// Lists Services with the user's own permissions: one namespace, or every namespace
// (namespace undefined) when the user may list Services cluster-wide.
// homeNamespace (the browser's) sorts first.
export function useServiceSuggestions(namespace: string | undefined, homeNamespace?: string) {
  const [canListClusterWide] = useAccessReview({ group: "", resource: "services", verb: "list" });
  const isClusterWide = !namespace && canListClusterWide;

  const [services, loaded, loadError] = useK8sWatchResource<K8sResourceKind[]>(
    namespace || isClusterWide ? { groupVersionKind: serviceGVK, isList: true, namespace } : null
  );

  const suggestions = React.useMemo(
    () =>
      toSuggestions(services ?? []).sort(
        (a, b) =>
          Number(b.namespace === homeNamespace) - Number(a.namespace === homeNamespace) ||
          a.namespace.localeCompare(b.namespace) ||
          a.name.localeCompare(b.name) ||
          a.port - b.port
      ),
    [services, homeNamespace]
  );

  // Namespaces that have at least one Service, derived from the cluster-wide list.
  const namespaces = React.useMemo(() => {
    const counts = new Map<string, number>();
    (services ?? []).forEach((s) => {
      const ns = s.metadata?.namespace ?? "";
      counts.set(ns, (counts.get(ns) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([name, serviceCount]): NamespaceSummary => ({ name, serviceCount }))
      .sort(
        (a, b) =>
          Number(b.name === homeNamespace) - Number(a.name === homeNamespace) ||
          a.name.localeCompare(b.name)
      );
  }, [services, homeNamespace]);

  return { suggestions, namespaces, loaded, loadError, canListClusterWide };
}

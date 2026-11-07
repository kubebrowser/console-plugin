import * as React from "react";
import {
  K8sResourceKind,
  useAccessReview,
  useK8sWatchResource
} from "@openshift-console/dynamic-plugin-sdk";
import { serviceGVK } from "../utils/gvk";
import { NamespaceSummary, toSuggestions } from "../utils/services";

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

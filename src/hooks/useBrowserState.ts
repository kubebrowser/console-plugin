import * as React from "react";
import { consoleFetchJSON } from "@openshift-console/dynamic-plugin-sdk";
import { K8sBrowser } from "../types/browser";

const POLL_INTERVAL_MS = 2000;

export type BrowserState = { url: string; title: string };

// Polls the browser's state subresource while the browser is ready and the tab is visible.
// Returns undefined until the first response; failed polls keep the last state.
export function useBrowserState(browser?: K8sBrowser): BrowserState | undefined {
  const [state, setState] = React.useState<BrowserState>();
  const namespace = browser?.metadata.namespace;
  const name = browser?.metadata.name;
  const isReady = browser?.status?.deploymentStatus === "Ready";

  React.useEffect(() => {
    setState(undefined);
    if (!isReady || !namespace || !name) return;

    const url = `/api/kubernetes/apis/subresource.kubebrowser.io/v1alpha1/namespaces/${namespace}/browsers/${name}/state`;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      if (!document.hidden) {
        try {
          const next: BrowserState = await consoleFetchJSON(url);
          if (!cancelled) {
            setState((prev) =>
              prev?.url === next.url && prev?.title === next.title ? prev : next
            );
          }
        } catch {
          // the browser may be restarting, or browser-api may predate the state subresource
        }
      }
      if (!cancelled) timer = setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [namespace, name, isReady]);

  return state;
}

import * as React from "react";
import { isConnectionEncrypted, WS, WSS } from "../components/VncConsole/utils";
import { K8sBrowser } from "../types/browser";

const MIN_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;

export type BrowserState = { url: string };

// Follows the browser's state subresource while the browser is ready, reconnecting when the socket drops.
// Returns undefined until the first message; while disconnected it keeps the last state.
export function useBrowserState(browser?: K8sBrowser): BrowserState | undefined {
  const [state, setState] = React.useState<BrowserState>();
  const namespace = browser?.metadata.namespace;
  const name = browser?.metadata.name;
  const isReady = browser?.status?.deploymentStatus === "Ready";

  React.useEffect(() => {
    setState(undefined);
    if (!isReady || !namespace || !name) return;

    const scheme = isConnectionEncrypted() ? WSS : WS;
    const url = `${scheme}://${window.location.host}/api/kubernetes/apis/subresource.kubebrowser.io/v1alpha1/watch/namespaces/${namespace}/browsers/${name}/state`;
    let socket: WebSocket;
    let timer: ReturnType<typeof setTimeout>;
    let delay = MIN_RECONNECT_DELAY_MS;
    let cancelled = false;

    function connect() {
      socket = new WebSocket(url);
      socket.onmessage = (event) => {
        delay = MIN_RECONNECT_DELAY_MS;
        setState(JSON.parse(event.data));
      };
      // the browser may be restarting, or browser-api may predate the state subresource
      socket.onclose = () => {
        if (cancelled) return;
        timer = setTimeout(connect, delay);
        delay = Math.min(delay * 2, MAX_RECONNECT_DELAY_MS);
      };
    }

    connect();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      socket.close();
    };
  }, [namespace, name, isReady]);

  return state;
}

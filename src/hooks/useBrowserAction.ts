import * as React from "react";
import { consoleFetch } from "@openshift-console/dynamic-plugin-sdk";
import { K8sBrowser } from "../types/browser";
import { getErrorDetail } from "../utils/errors";
import { usePluginTranslation } from "./usePluginTranslation";

export enum ControlActions {
  navigate = "page-navigate",
  backward = "page-goback",
  forward = "page-goforward",
  reload = "page-reload"
}

export type ActionError = { message: string; hint?: string };

const SERVICE_URL = /\.svc(\.cluster\.local)?(:\d+)?(\/|$)/;
const UNREACHABLE = /timed.?out|timeout|refused|unreachable/i;

// Sends actions to the browser's action subresource, one at a time, and keeps the last error.
export function useBrowserAction(browser?: K8sBrowser) {
  const { t } = usePluginTranslation();
  const [loadingAction, setLoadingAction] = React.useState<ControlActions | undefined>();
  const [actionError, setActionError] = React.useState<ActionError>();

  async function sendAction(args: { kind: ControlActions; url?: string }) {
    try {
      const url = `/api/kubernetes/apis/subresource.kubebrowser.io/v1alpha1/namespaces/${browser?.metadata.namespace}/browsers/${browser?.metadata.name}/action`;
      await consoleFetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args)
      });
      setActionError(undefined);
    } catch (err) {
      const message: string =
        (await getErrorDetail(err)) || t("An error occurred. Please try again.") || "";
      const hint =
        args.url && SERVICE_URL.test(args.url) && UNREACHABLE.test(message)
          ? t(
              "The browser couldn't reach this Service. A NetworkPolicy in its namespace may block traffic from the browser."
            )
          : undefined;
      setActionError({ message, hint });
    }
  }

  async function runAction(kind: ControlActions, url?: string) {
    if (loadingAction) return;
    setLoadingAction(kind);
    await sendAction({ kind, url });
    setLoadingAction(undefined);
  }

  return {
    loadingAction,
    actionError,
    clearActionError: () => setActionError(undefined),
    runAction
  };
}

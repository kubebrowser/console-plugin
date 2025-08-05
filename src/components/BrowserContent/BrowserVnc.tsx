import * as React from "react";
import { FC } from "react";
import { K8sBrowser } from "../../types/browser";
import { VncConsole } from "../VncConsole/VncConsole";

export const BrowserVnc: FC<{ browser: K8sBrowser }> = ({ browser }) => {
  return (
    <VncConsole
      path={`/api/kubernetes/apis/subresource.kubebrowser.io/v1alpha1/namespaces/${browser.metadata.namespace}/browsers/${browser.metadata.name}/vnc`}
    />
  );
};

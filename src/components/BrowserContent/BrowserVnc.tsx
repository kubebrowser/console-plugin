import * as React from "react";
import { FC } from "react";
import { K8sBrowser } from "../../types/browser";
import { VncConsole } from "../VncConsole/VncConsole";

export const BrowserVnc: FC<{ browser: K8sBrowser }> = ({ browser }) => {
  const path = `/api/kubernetes/apis/subresource.kubebrowser.io/v1alpha1/namespaces/${browser.metadata.namespace}/browsers/${browser.metadata.name}/vnc`;

  // VncConsole keeps its connection in state, so give each browser its own instance;
  // otherwise switching browsers leaves the old connection behind and lands on "Connect".
  return <VncConsole key={path} path={path} />;
};

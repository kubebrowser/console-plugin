import * as React from "react";
import { K8sBrowser } from "../../types/browser";
import { BrowserStoppedState } from "./BrowserStoppedState";
import { BrowserProgressingState } from "./BrowserProgressingState";
import { BrowserUnknownState } from "./BrowserUnknownState";
import { BrowserVnc } from "./BrowserVnc";
import { NoBrowserState } from "./NoBrowserState";

export const BrowserContent: React.FC<{ browser?: K8sBrowser }> = ({ browser }) => {
  if (!browser) {
    return <NoBrowserState />;
  }

  if (browser.status?.deploymentStatus === "Progressing") {
    return <BrowserProgressingState specStarted={browser.spec.started} />;
  }

  if (browser.status?.deploymentStatus === "Ready" && browser.spec.started) {
    return <BrowserVnc browser={browser} />;
  }

  if (browser.spec.started === false) {
    return (
      <BrowserStoppedState
        browserName={browser.metadata.name!}
        browserNamespace={browser.metadata.namespace!}
      />
    );
  }

  return (
    <BrowserUnknownState
      browserName={browser.metadata.name!}
      browserNamespace={browser.metadata.namespace!}
    />
  );
};

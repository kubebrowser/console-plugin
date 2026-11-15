import { Flex, FlexItem } from "@patternfly/react-core";
import { ArrowLeftIcon, ArrowRightIcon, RedoIcon } from "@patternfly/react-icons";
import * as React from "react";
import { K8sBrowser } from "../../types/browser";
import { ControlActions, useBrowserAction } from "../../hooks/useBrowserAction";
import { useBrowserState } from "../../hooks/useBrowserState";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { addressBarUrl } from "../../utils/url";
import { AddressField } from "../AddressField/AddressField";
import { ActionErrorToast } from "./ActionErrorToast";
import { NavButton } from "./NavButton";

export const BrowserControlToolbar: React.FC<{ browser?: K8sBrowser }> = ({ browser }) => {
  const { t } = usePluginTranslation();
  const { loadingAction, actionError, clearActionError, runAction } = useBrowserAction(browser);
  const isReady = browser?.status?.deploymentStatus === "Ready";
  const pageState = useBrowserState(browser);
  const isDisabled = !isReady || !!loadingAction;

  const navButtons: [ControlActions, string, React.ReactNode][] = [
    [ControlActions.backward, t("Back"), <ArrowLeftIcon />],
    [ControlActions.forward, t("Forward"), <ArrowRightIcon />],
    [ControlActions.reload, t("Reload"), <RedoIcon />]
  ];

  return (
    <>
      <Flex
        alignItems={{ default: "alignItemsCenter" }}
        flexWrap={{ default: "nowrap" }}
        spaceItems={{ default: "spaceItemsXs" }}
        style={{ padding: "var(--pf-t--global--spacer--xs) var(--pf-t--global--spacer--sm)" }}
      >
        {navButtons.map(([kind, label, icon]) => (
          <FlexItem key={kind}>
            <NavButton
              label={label}
              icon={icon}
              isDisabled={isDisabled}
              isLoading={loadingAction === kind}
              onClick={() => runAction(kind)}
            />
          </FlexItem>
        ))}
        <FlexItem grow={{ default: "grow" }}>
          <AddressField
            browserNamespace={browser?.metadata.namespace}
            currentUrl={pageState && addressBarUrl(pageState.url)}
            placeholder={
              browser && !isReady
                ? t("Waiting for the browser to be ready…")
                : t("Search Services or enter a URL")
            }
            isDisabled={isDisabled}
            isNavigating={loadingAction === ControlActions.navigate}
            onNavigate={(url) => runAction(ControlActions.navigate, url)}
          />
        </FlexItem>
      </Flex>
      <ActionErrorToast error={actionError} onClose={clearActionError} />
    </>
  );
};

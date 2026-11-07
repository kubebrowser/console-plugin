import { Button, Flex, FlexItem, Spinner, Tooltip } from "@patternfly/react-core";
import { ArrowLeftIcon, ArrowRightIcon, RedoIcon } from "@patternfly/react-icons";
import * as React from "react";
import { K8sBrowser } from "../../types/browser";
import { ControlActions, useBrowserAction } from "../../hooks/useBrowserAction";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { ActionErrorToast } from "./ActionErrorToast";
import { AddressField } from "./AddressField";

export const BrowserControlToolbar: React.FC<{ browser?: K8sBrowser }> = ({ browser }) => {
  const { t } = usePluginTranslation();
  const { loadingAction, actionError, clearActionError, runAction } = useBrowserAction(browser);
  const isReady = browser?.status?.deploymentStatus === "Ready";
  const isDisabled = !isReady || !!loadingAction;

  function navButton(kind: ControlActions, label: string, icon: React.ReactNode) {
    return (
      <Tooltip content={label}>
        <Button
          aria-label={label}
          isDisabled={isDisabled}
          onClick={() => runAction(kind)}
          icon={loadingAction === kind ? <Spinner size="sm" /> : icon}
          variant="plain"
        />
      </Tooltip>
    );
  }

  return (
    <>
      <Flex
        alignItems={{ default: "alignItemsCenter" }}
        flexWrap={{ default: "nowrap" }}
        spaceItems={{ default: "spaceItemsXs" }}
        style={{ padding: "var(--pf-t--global--spacer--xs) var(--pf-t--global--spacer--sm)" }}
      >
        <FlexItem>{navButton(ControlActions.backward, t("Back"), <ArrowLeftIcon />)}</FlexItem>
        <FlexItem>{navButton(ControlActions.forward, t("Forward"), <ArrowRightIcon />)}</FlexItem>
        <FlexItem>{navButton(ControlActions.reload, t("Reload"), <RedoIcon />)}</FlexItem>
        <FlexItem grow={{ default: "grow" }}>
          <AddressField
            browserNamespace={browser?.metadata.namespace}
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

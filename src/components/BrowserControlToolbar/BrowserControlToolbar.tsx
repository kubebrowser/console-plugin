import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ActionList,
  ActionListGroup,
  ActionListItem,
  Button,
  TextInput,
  Spinner
} from "@patternfly/react-core";
import { ChevronLeftIcon, ChevronRightIcon, UndoIcon } from "@patternfly/react-icons";
import * as React from "react";
import { K8sBrowser } from "../../types/browser";
import { consoleFetch } from "@openshift-console/dynamic-plugin-sdk";
import { useTranslation } from "react-i18next";

enum ControlActions {
  navigate = "page-navigate",
  backward = "page-goback",
  forward = "page-goforward",
  reload = "page-reload",
  reset = "page-reset"
}

export const BrowserControlToolbar: React.FC<{ browser?: K8sBrowser }> = ({ browser }) => {
  const [loadingAction, setLoadingAction] = React.useState<string | undefined>();
  const [isHovered, setHovered] = React.useState(false);
  const isDisabled = !browser || browser.status?.deploymentStatus !== "Ready" || !!loadingAction;
  const inputRef = React.createRef<HTMLInputElement>();

  const { t } = useTranslation();

  function onMouseEnter() {
    setHovered(true);
  }

  function onMouseLeave() {
    setHovered(false);
  }

  async function sendAction(args: { kind: string; url?: string }) {
    try {
      const url = `/api/kubernetes/apis/subresource.kubebrowser.io/v1alpha1/namespaces/${browser?.metadata.namespace}/browsers/${browser?.metadata.name}/action`;
      const response = await consoleFetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(args)
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  async function pageGoBack() {
    if (loadingAction) return;
    setLoadingAction(ControlActions.backward);
    await sendAction({ kind: ControlActions.backward });
    setLoadingAction(undefined);
  }

  async function pageGoForward() {
    if (loadingAction) return;
    setLoadingAction(ControlActions.forward);
    await sendAction({ kind: ControlActions.forward });
    setLoadingAction(undefined);
  }

  async function pageReload() {
    if (loadingAction) return;
    setLoadingAction(ControlActions.reload);
    await sendAction({ kind: ControlActions.reload });
    setLoadingAction(undefined);
  }

  async function navigateToUrl() {
    if (loadingAction) return;
    setLoadingAction(ControlActions.navigate);
    await sendAction({ kind: ControlActions.navigate, url: inputRef.current?.value });
    setLoadingAction(undefined);
  }

  async function pageReset() {
    if (loadingAction) return;
    setLoadingAction(ControlActions.reset);
    await sendAction({ kind: ControlActions.reset });
    setLoadingAction(undefined);
  }

  function onTextInputKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      navigateToUrl();
    }
  }

  return (
    <Toolbar
      style={{
        padding: 16,
        opacity: isDisabled || isHovered ? 1 : "0.3",
        transition: "opacity 0.5s linear"
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ToolbarContent>
        <ToolbarGroup align={{ default: "alignStart" }}>
          <ActionList>
            <ActionListGroup>
              <ActionListItem style={{ display: undefined }}>
                <Button isDisabled={isDisabled} variant="control" onClick={pageReset}>
                  {loadingAction === ControlActions.navigate ? <Spinner size="sm" /> : t("Reset")}
                  {/* AngleDoubleLeftIcon ? */}
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button
                  isDisabled={isDisabled}
                  onClick={pageGoBack}
                  icon={
                    loadingAction === ControlActions.backward ? (
                      <Spinner size="sm" />
                    ) : (
                      <ChevronLeftIcon />
                    )
                  }
                  variant="control"
                />
              </ActionListItem>
              <ActionListItem>
                <Button
                  isDisabled={isDisabled}
                  onClick={pageGoForward}
                  icon={
                    loadingAction === ControlActions.forward ? (
                      <Spinner size="sm" />
                    ) : (
                      <ChevronRightIcon />
                    )
                  }
                  variant="control"
                />
              </ActionListItem>
              <ActionListItem>
                <Button
                  isDisabled={isDisabled}
                  onClick={pageReload}
                  icon={
                    loadingAction === ControlActions.reload ? <Spinner size="sm" /> : <UndoIcon />
                  }
                  variant="control"
                />
              </ActionListItem>
            </ActionListGroup>
          </ActionList>
        </ToolbarGroup>
        <ToolbarGroup align={{ default: "alignEnd" }}>
          <ActionList>
            <ActionListGroup>
              <ActionListItem>
                <TextInput
                  placeholder="http://myserver.svc.cluster.local:8080"
                  style={{ width: "300px" }}
                  ref={inputRef}
                  onKeyUp={onTextInputKeyUp}
                  isDisabled={isDisabled}
                />
              </ActionListItem>

              <ActionListItem>
                <Button isDisabled={isDisabled} variant="control" onClick={navigateToUrl}>
                  {loadingAction === ControlActions.navigate ? <Spinner size="sm" /> : t("Go")}
                </Button>
              </ActionListItem>
            </ActionListGroup>
          </ActionList>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

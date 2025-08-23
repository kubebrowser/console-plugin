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
import { usePluginTranslation } from "../../hooks/usePluginTranslation";

enum ControlActions {
  navigate = "page-navigate",
  backward = "page-goback",
  forward = "page-goforward",
  reload = "page-reload",
  reset = "page-reset"
}

export const BrowserControlToolbar: React.FC<{ browser?: K8sBrowser }> = ({ browser }) => {
  const [loadingAction, setLoadingAction] = React.useState<string | undefined>();
  const [isHovered, setHovered] = React.useState<string | undefined>();
  const [isHidden, setHidden] = React.useState(false);
  const isDisabled = !browser || browser.status?.deploymentStatus !== "Ready" || !!loadingAction;
  const inputRef = React.createRef<HTMLInputElement>();

  const { t } = usePluginTranslation();

  function onMouseEnterSubject(name: string) {
    setHovered(name);
  }

  function onMouseLeaveSubject() {
    setHovered(undefined);
  }

  function toggleHidden() {
    setHidden(!isHidden);
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

  function getHoverConfig(name: string) {
    return {
      style: {
        opacity: isDisabled || isHovered === name ? 1 : "0.3",
        transition: "opacity 200ms linear"
      },
      onMouseEnter: () => onMouseEnterSubject(name),
      onMouseLeave: () => onMouseLeaveSubject()
    };
  }

  return (
    <Toolbar style={{ padding: 16 }}>
      <ToolbarContent>
        <ToolbarGroup align={{ default: "alignStart" }}>
          <ActionList>
            <ActionListGroup {...getHoverConfig("one")}>
              <ActionListItem>
                <Button isDisabled={isDisabled} variant="control" onClick={toggleHidden}>
                  {isHidden ? "Show" : "Hide"} Controls
                </Button>
              </ActionListItem>
            </ActionListGroup>
          </ActionList>
        </ToolbarGroup>

        <ToolbarGroup
          align={{ default: "alignStart" }}
          style={{ display: isHidden ? "none" : undefined }}
        >
          <ActionList>
            <ActionListGroup {...getHoverConfig("two")}>
              <ActionListItem style={{ display: "none" }}>
                <Button isDisabled={isDisabled} variant="control" onClick={pageReset}>
                  {loadingAction === ControlActions.navigate ? <Spinner size="sm" /> : t("Reset")}
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
        <ToolbarGroup
          align={{ default: "alignEnd" }}
          style={{ display: isHidden ? "none" : undefined }}
        >
          <ActionList>
            <ActionListGroup {...getHoverConfig("three")}>
              <ActionListItem>
                <TextInput
                  placeholder="http://myserver.svc.cluster.local:8080"
                  style={{ width: "300px" }}
                  ref={inputRef}
                  id="browser-url-input"
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

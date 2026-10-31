import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ActionList,
  ActionListGroup,
  ActionListItem,
  Alert,
  AlertActionCloseButton,
  Button,
  TextInput,
  Spinner,
  Tooltip
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

const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;

// Mirror browser address bars: assume http:// when no scheme is typed.
function normalizeUrl(input: string): string {
  return SCHEME_PATTERN.test(input) ? input : `http://${input}`;
}

export const BrowserControlToolbar: React.FC<{ browser?: K8sBrowser }> = ({ browser }) => {
  const [loadingAction, setLoadingAction] = React.useState<string | undefined>();
  const [isHovered, setHovered] = React.useState<string | undefined>();
  const [isHidden, setHidden] = React.useState(false);
  const [isInputFocused, setInputFocused] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | undefined>();
  const isDisabled = !browser || browser.status?.deploymentStatus !== "Ready" || !!loadingAction;
  const inputRef = React.useRef<HTMLInputElement>(null);

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
      setActionError(undefined);
    } catch (err) {
      console.log(err);
      setActionError((err as Error)?.message || t("An error occurred. Please try again."));
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
    const input = inputRef.current?.value.trim();
    if (!input) return;
    setLoadingAction(ControlActions.navigate);
    await sendAction({ kind: ControlActions.navigate, url: normalizeUrl(input) });
    setLoadingAction(undefined);
  }

  async function pageReset() {
    if (loadingAction) return;
    setLoadingAction(ControlActions.reset);
    await sendAction({ kind: ControlActions.reset });
    setLoadingAction(undefined);
  }

  function onTextInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      navigateToUrl();
    }
  }

  function getHoverConfig(name: string) {
    return {
      style: {
        opacity:
          isDisabled || isHovered === name || (name === "three" && isInputFocused) ? 1 : "0.6",
        transition: "opacity 200ms linear"
      },
      onMouseEnter: () => onMouseEnterSubject(name),
      onMouseLeave: () => onMouseLeaveSubject()
    };
  }

  return (
    <>
      <Toolbar style={{ padding: 16 }}>
        <ToolbarContent>
          <ToolbarGroup align={{ default: "alignStart" }}>
            <ActionList>
              <ActionListGroup {...getHoverConfig("one")}>
                <ActionListItem>
                  <Button isDisabled={isDisabled} variant="control" onClick={toggleHidden}>
                    {isHidden ? t("Show Controls") : t("Hide Controls")}
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
                  <Tooltip content={t("Back")}>
                    <Button
                      aria-label={t("Back")}
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
                  </Tooltip>
                </ActionListItem>
                <ActionListItem>
                  <Tooltip content={t("Forward")}>
                    <Button
                      aria-label={t("Forward")}
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
                  </Tooltip>
                </ActionListItem>
                <ActionListItem>
                  <Tooltip content={t("Reload")}>
                    <Button
                      aria-label={t("Reload")}
                      isDisabled={isDisabled}
                      onClick={pageReload}
                      icon={
                        loadingAction === ControlActions.reload ? (
                          <Spinner size="sm" />
                        ) : (
                          <UndoIcon />
                        )
                      }
                      variant="control"
                    />
                  </Tooltip>
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
                    aria-label={t("URL")}
                    onKeyDown={onTextInputKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
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
      {actionError && (
        <Alert
          isInline
          variant="danger"
          title={t("Browser action failed")}
          actionClose={<AlertActionCloseButton onClose={() => setActionError(undefined)} />}
          style={{ margin: "0 16px" }}
        >
          {actionError}
        </Alert>
      )}
    </>
  );
};

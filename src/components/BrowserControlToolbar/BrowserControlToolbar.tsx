import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  Button,
  Flex,
  FlexItem,
  Spinner,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Tooltip
} from "@patternfly/react-core";
import { ArrowLeftIcon, ArrowRightIcon, RedoIcon } from "@patternfly/react-icons";
import * as React from "react";
import { K8sBrowser } from "../../types/browser";
import { consoleFetch } from "@openshift-console/dynamic-plugin-sdk";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";

enum ControlActions {
  navigate = "page-navigate",
  backward = "page-goback",
  forward = "page-goforward",
  reload = "page-reload"
}

const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;

// Mirror browser address bars: assume http:// when no scheme is typed.
function normalizeUrl(input: string): string {
  return SCHEME_PATTERN.test(input) ? input : `http://${input}`;
}

// consoleFetch errors only carry the HTTP status text; the browser API puts the
// actual reason in the (plain text) response body.
async function getErrorDetail(err: unknown): Promise<string | undefined> {
  const { response, json } = err as { response?: Response; json?: { message?: string } };
  if (json?.message) return json.message;
  if (response && !response.bodyUsed) {
    try {
      const text = (await response.text()).trim();
      if (text) return text;
    } catch {
      // Fall back to the error message below.
    }
  }
  return (err as Error)?.message;
}

export const BrowserControlToolbar: React.FC<{ browser?: K8sBrowser }> = ({ browser }) => {
  const [loadingAction, setLoadingAction] = React.useState<string | undefined>();
  const [actionError, setActionError] = React.useState<string | undefined>();
  const isDisabled = !browser || browser.status?.deploymentStatus !== "Ready" || !!loadingAction;
  const [urlInput, setUrlInput] = React.useState("");

  const { t } = usePluginTranslation();

  async function sendAction(args: { kind: string; url?: string }) {
    try {
      const url = `/api/kubernetes/apis/subresource.kubebrowser.io/v1alpha1/namespaces/${browser?.metadata.namespace}/browsers/${browser?.metadata.name}/action`;
      await consoleFetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(args)
      });
      setActionError(undefined);
    } catch (err) {
      console.log(err);
      setActionError((await getErrorDetail(err)) || t("An error occurred. Please try again."));
    }
  }

  async function runAction(kind: ControlActions, url?: string) {
    if (loadingAction) return;
    setLoadingAction(kind);
    await sendAction({ kind, url });
    setLoadingAction(undefined);
  }

  function navigateToUrl() {
    const input = urlInput.trim();
    if (!input) return;
    runAction(ControlActions.navigate, normalizeUrl(input));
  }

  function onTextInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      navigateToUrl();
    }
  }

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
          <TextInputGroup isDisabled={isDisabled}>
            <TextInputGroupMain
              placeholder="http://myserver.svc.cluster.local:8080"
              value={urlInput}
              onChange={(_e, value) => setUrlInput(value)}
              inputId="browser-url-input"
              aria-label={t("URL")}
              onKeyDown={onTextInputKeyDown}
            />
            {loadingAction === ControlActions.navigate && (
              <TextInputGroupUtilities>
                <Spinner size="sm" aria-label={t("Loading")} />
              </TextInputGroupUtilities>
            )}
          </TextInputGroup>
        </FlexItem>
      </Flex>
      <AlertGroup isToast isLiveRegion>
        {actionError && (
          <Alert
            variant="danger"
            title={t("Browser action failed")}
            timeout={8000}
            onTimeout={() => setActionError(undefined)}
            actionClose={<AlertActionCloseButton onClose={() => setActionError(undefined)} />}
          >
            {actionError}
          </Alert>
        )}
      </AlertGroup>
    </>
  );
};

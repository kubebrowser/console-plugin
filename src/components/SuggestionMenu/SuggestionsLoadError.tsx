import * as React from "react";
import { Alert } from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { getErrorMessage, getErrorStatus } from "../../utils/errors";

// Listing failed: say why, and that typing a URL still works.
export const SuggestionsLoadError: React.FC<{ error: unknown; namespace?: string }> = ({
  error,
  namespace
}) => {
  const { t } = usePluginTranslation();
  const isForbidden = getErrorStatus(error) === 403;
  const title = isForbidden
    ? namespace
      ? t("You can't list Services in {{name}}", { name: namespace })
      : t("You can't list Services in all namespaces")
    : t("Couldn't load Services");
  const detail = isForbidden
    ? t("You can still open a Service by typing its URL.")
    : `${getErrorMessage(error)}. ${t("Retrying automatically. You can still type a URL.")}`;
  return (
    // The menu adds its own spacer--sm below, matching the breadcrumb's spacing above.
    <div style={{ padding: "0 var(--pf-t--global--spacer--md) var(--pf-t--global--spacer--sm)" }}>
      <Alert isInline isPlain variant={isForbidden ? "warning" : "danger"} title={title}>
        {detail}
      </Alert>
    </div>
  );
};

import * as React from "react";
import { EmptyState, EmptyStateBody } from "@patternfly/react-core";
import { QuestionCircleIcon } from "@patternfly/react-icons";
import { ResourceLink } from "@openshift-console/dynamic-plugin-sdk";
import { deploymentGVK } from "../../utils/gvk";
import { useTranslation } from "react-i18next";

export const BrowserUnknownState: React.FC<{ browserName: string; browserNamespace: string }> = ({
  browserName,
  browserNamespace
}) => {
  const { t } = useTranslation();
  return (
    <EmptyState
      titleText={t("Browser state unknown")}
      headingLevel="h4"
      icon={QuestionCircleIcon}
      isFullHeight
    >
      <EmptyStateBody>
        {t("Unable to identity the browser state. See the deployment")}:{" "}
        <ResourceLink
          groupVersionKind={deploymentGVK}
          name={browserName}
          namespace={browserNamespace}
        />
      </EmptyStateBody>
    </EmptyState>
  );
};

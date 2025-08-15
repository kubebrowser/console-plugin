import * as React from "react";
import { EmptyState, EmptyStateBody } from "@patternfly/react-core";
import { InProgressIcon } from "@patternfly/react-icons";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";

export const BrowserProgressingState: React.FC<{ specStarted: boolean }> = ({ specStarted }) => {
  const { t } = usePluginTranslation();
  return (
    <EmptyState
      titleText={specStarted ? t("Browser is starting") : t("Browser is stopping")}
      headingLevel="h4"
      color="red"
      status="warning"
      icon={InProgressIcon}
      isFullHeight
    >
      <EmptyStateBody>
        {specStarted
          ? t("Waiting for browser deployment to be ready.")
          : t("Terminating browser deployment.")}
      </EmptyStateBody>
      {/* link to deployment */}
    </EmptyState>
  );
};

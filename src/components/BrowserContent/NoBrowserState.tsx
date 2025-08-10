import { EmptyState, EmptyStateBody, EmptyStateFooter } from "@patternfly/react-core";
import { BlueprintIcon } from "@patternfly/react-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";

export const NoBrowserState = () => {
  const { t } = useTranslation();
  return (
    <EmptyState
      titleText={t("Nothing to render")}
      headingLevel="h4"
      icon={BlueprintIcon}
      isFullHeight
    >
      <EmptyStateBody>{t("Select a Browser")}.</EmptyStateBody>
      <EmptyStateFooter></EmptyStateFooter>
    </EmptyState>
  );
};

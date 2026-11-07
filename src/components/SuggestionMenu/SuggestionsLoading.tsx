import * as React from "react";
import { Flex, Skeleton } from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";

// Placeholder rows shaped like Service rows, so the menu doesn't jump when they load.
export const SuggestionsLoading: React.FC = () => {
  const { t } = usePluginTranslation();
  return (
    <div
      role="status"
      style={{
        display: "grid",
        gap: "var(--pf-t--global--spacer--md)",
        padding: "var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)"
      }}
    >
      {[45, 30, 38].map((width, i) => (
        <Flex
          key={i}
          spaceItems={{ default: "spaceItemsSm" }}
          alignItems={{ default: "alignItemsCenter" }}
        >
          <Skeleton shape="circle" width="24px" height="18px" />
          <div style={{ flex: 1, display: "grid", gap: 4 }}>
            <Skeleton width={`${width}%`} height="14px" />
            <Skeleton width={`${width + 15}%`} height="10px" />
          </div>
        </Flex>
      ))}
      <span className="pf-v6-screen-reader">{t("Loading Services")}</span>
    </div>
  );
};

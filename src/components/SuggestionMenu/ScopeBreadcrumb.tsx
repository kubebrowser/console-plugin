import * as React from "react";
import { Breadcrumb, BreadcrumbItem, Flex } from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { ALL_NAMESPACES_ROW, optionId } from "../../utils/suggestionView";
import { NamespaceIcon } from "../ResourceIcon/NamespaceIcon";

// Breadcrumbs saying which namespace is listed, with the way up to all namespaces.
export const ScopeBreadcrumb: React.FC<{
  namespace?: string;
  canGoUp: boolean;
  isFocused: boolean;
  onGoUp: () => void;
}> = ({ namespace, canGoUp, isFocused, onGoUp }) => {
  const { t } = usePluginTranslation();
  const isAllNamespaces = !namespace;
  return (
    <Breadcrumb
      aria-label={t("Service scope")}
      style={{ padding: "var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)" }}
    >
      {(isAllNamespaces || canGoUp) && (
        <BreadcrumbItem
          isActive={isAllNamespaces}
          render={
            canGoUp
              ? ({ className }) => (
                  <button
                    type="button"
                    id={optionId(ALL_NAMESPACES_ROW)}
                    className={className}
                    // Keep the focus in the input so typing keeps filtering.
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={onGoUp}
                    style={
                      isFocused
                        ? {
                            outline:
                              "var(--pf-t--global--border--width--strong) solid var(--pf-t--global--border--color--clicked)",
                            outlineOffset: 2
                          }
                        : undefined
                    }
                  >
                    {t("All namespaces")}
                  </button>
                )
              : undefined
          }
        >
          {!canGoUp && t("All namespaces")}
        </BreadcrumbItem>
      )}
      {!isAllNamespaces && (
        <BreadcrumbItem isActive>
          <Flex
            spaceItems={{ default: "spaceItemsSm" }}
            alignItems={{ default: "alignItemsCenter" }}
          >
            <NamespaceIcon />
            <span>{namespace}</span>
          </Flex>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
};

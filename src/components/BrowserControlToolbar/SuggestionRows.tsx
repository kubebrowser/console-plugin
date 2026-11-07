import * as React from "react";
import {
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Label,
  SelectOption,
  Skeleton,
  Tooltip
} from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { NamespaceSummary, ServiceSuggestion } from "../../hooks/useServiceSuggestions";
import { getErrorMessage, getErrorStatus } from "../../utils/errors";
import { NamespaceIcon } from "../ResourceIcon/NamespaceIcon";
import { ServiceIcon } from "../ResourceIcon/ServiceIcon";
import { ALL_NAMESPACES_ROW, NAMESPACE_ROW_PREFIX, optionId } from "./suggestionView";

export const ServiceOption: React.FC<{ service: ServiceSuggestion; isFocused: boolean }> = ({
  service: s,
  isFocused
}) => {
  const { t } = usePluginTranslation();
  return (
    <SelectOption
      value={s.id}
      id={optionId(s.id)}
      isFocused={isFocused}
      icon={<ServiceIcon aria-hidden />}
      description={s.url}
    >
      <Flex spaceItems={{ default: "spaceItemsSm" }} alignItems={{ default: "alignItemsCenter" }}>
        <FlexItem>{s.name}</FlexItem>
        <FlexItem>
          <Label isCompact>
            {s.port}
            {s.portName ? ` · ${s.portName}` : ""}
          </Label>
        </FlexItem>
        {s.variant !== "ClusterIP" && (
          <FlexItem>
            <Tooltip
              content={
                s.variant === "Headless"
                  ? t("Headless Service: no cluster IP, DNS resolves to the pods directly.")
                  : t("ExternalName Service: opens the external host it points to.")
              }
            >
              <Label isCompact variant="outline">
                {s.variant === "Headless" ? t("Headless") : t("External")}
              </Label>
            </Tooltip>
          </FlexItem>
        )}
      </Flex>
    </SelectOption>
  );
};

export const NamespaceOption: React.FC<{
  namespace: NamespaceSummary;
  isBrowserNamespace: boolean;
  isFocused: boolean;
}> = ({ namespace: ns, isBrowserNamespace, isFocused }) => {
  const { t } = usePluginTranslation();
  const value = NAMESPACE_ROW_PREFIX + ns.name;
  return (
    <SelectOption value={value} id={optionId(value)} isFocused={isFocused} icon={<NamespaceIcon />}>
      <Flex spaceItems={{ default: "spaceItemsSm" }} alignItems={{ default: "alignItemsCenter" }}>
        <FlexItem>{ns.name}</FlexItem>
        <FlexItem>
          <Tooltip content={t("{{count}} Services", { count: ns.serviceCount })}>
            <Badge isRead>{ns.serviceCount}</Badge>
          </Tooltip>
        </FlexItem>
        {isBrowserNamespace && (
          <FlexItem>
            <Label isCompact variant="outline">
              {t("Browser's namespace")}
            </Label>
          </FlexItem>
        )}
      </Flex>
    </SelectOption>
  );
};

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

// Placeholder rows shaped like Service rows, so the menu doesn't jump when they load.
export const LoadingRows: React.FC = () => {
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

// Listing failed: say why, and that typing a URL still works.
export const LoadError: React.FC<{ error: unknown; namespace?: string }> = ({
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

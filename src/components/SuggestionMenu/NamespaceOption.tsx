import * as React from "react";
import { Badge, Flex, FlexItem, Label, SelectOption, Tooltip } from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { NamespaceSummary } from "../../utils/services";
import { NAMESPACE_ROW_PREFIX, optionId } from "../../utils/suggestionView";
import { NamespaceIcon } from "../ResourceIcon/NamespaceIcon";

// A namespace with its Service count; picking it lists that namespace's Services.
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

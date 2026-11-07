import * as React from "react";
import { SelectGroup, SelectList } from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { NamespaceSummary } from "../../utils/services";
import { NAMESPACE_ROW_PREFIX } from "../../utils/suggestionView";
import { NamespaceOption } from "./NamespaceOption";

export const NamespaceList: React.FC<{
  namespaces: NamespaceSummary[];
  browserNamespace?: string;
  // While searching, namespaces are one labelled group among the Service results.
  isGrouped: boolean;
  focusedValue?: string;
}> = ({ namespaces, browserNamespace, isGrouped, focusedValue }) => {
  const { t } = usePluginTranslation();
  if (!namespaces.length) return null;
  const list = (
    <SelectList>
      {namespaces.map((ns) => (
        <NamespaceOption
          key={ns.name}
          namespace={ns}
          isBrowserNamespace={ns.name === browserNamespace}
          isFocused={focusedValue === NAMESPACE_ROW_PREFIX + ns.name}
        />
      ))}
    </SelectList>
  );
  return isGrouped ? <SelectGroup label={t("Namespaces")}>{list}</SelectGroup> : list;
};

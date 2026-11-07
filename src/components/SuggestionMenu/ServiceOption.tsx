import * as React from "react";
import { Flex, FlexItem, Label, SelectOption, Tooltip } from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { ServiceSuggestion } from "../../utils/services";
import { optionId } from "../../utils/suggestionView";
import { ServiceIcon } from "../ResourceIcon/ServiceIcon";

// One port of a Service, with the URL it opens.
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

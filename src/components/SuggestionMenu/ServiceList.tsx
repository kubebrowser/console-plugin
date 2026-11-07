import * as React from "react";
import { Divider, SelectGroup, SelectList } from "@patternfly/react-core";
import { ServiceSuggestion } from "../../utils/services";
import { ServiceOption } from "./ServiceOption";

// Services grouped by namespace. A single namespace is already named in the breadcrumb,
// so its group gets no label.
export const ServiceList: React.FC<{
  services: ServiceSuggestion[];
  showNamespaceLabels: boolean;
  // Start with a divider when something (the namespace list) is above.
  hasContentAbove: boolean;
  focusedValue?: string;
}> = ({ services, showNamespaceLabels, hasContentAbove, focusedValue }) => {
  const groups = services.reduce<Record<string, ServiceSuggestion[]>>((acc, s) => {
    (acc[s.namespace] ||= []).push(s);
    return acc;
  }, {});
  return (
    <>
      {Object.entries(groups).map(([ns, items], i) => {
        const list = (
          <SelectList>
            {items.map((s) => (
              <ServiceOption key={s.id} service={s} isFocused={focusedValue === s.id} />
            ))}
          </SelectList>
        );
        return (
          <React.Fragment key={ns}>
            {(i > 0 || hasContentAbove) && <Divider />}
            {showNamespaceLabels ? <SelectGroup label={ns}>{list}</SelectGroup> : list}
          </React.Fragment>
        );
      })}
    </>
  );
};

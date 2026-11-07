import * as React from "react";
import { Badge, BadgeProps } from "@patternfly/react-core";

export const serviceBadgeText = "S";
export const serviceBadgeColor = "#749a21";

export function ServiceIcon(props: BadgeProps) {
  return (
    <Badge {...props} style={{ backgroundColor: serviceBadgeColor }}>
      {serviceBadgeText}
    </Badge>
  );
}

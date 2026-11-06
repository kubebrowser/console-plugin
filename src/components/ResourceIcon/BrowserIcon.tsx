import * as React from "react";
import { Badge, BadgeProps } from "@patternfly/react-core";

export const browserBadgeText = "BR";
export const browserBadgeColor = "#0f7fa3";

export function BrowserIcon(props: BadgeProps) {
  return (
    <Badge {...props} style={{ backgroundColor: browserBadgeColor, ...props.style }}>
      {browserBadgeText}
    </Badge>
  );
}

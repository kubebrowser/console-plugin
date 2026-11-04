import * as React from "react";
import { Badge, BadgeProps } from "@patternfly/react-core";

export const namespaceBadgeText = "NS";
export const namespaceBadgeColor = "#2b4e1d";

export function NamespaceIcon(props: BadgeProps) {
  return (
    <Badge {...props} style={{ backgroundColor: namespaceBadgeColor }}>
      {namespaceBadgeText}
    </Badge>
  );
}

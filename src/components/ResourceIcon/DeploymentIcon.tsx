import * as React from "react";
import { Badge, BadgeProps } from "@patternfly/react-core";

export const deploymentBadgeText = "D";
export const deploymentBadgeColor = "var(--pf-v5-global--palette--blue-500)";

export function DeploymentIcon(props: BadgeProps) {
  return (
    <Badge {...props} style={{ backgroundColor: deploymentBadgeColor }}>
      {deploymentBadgeText}
    </Badge>
  );
}

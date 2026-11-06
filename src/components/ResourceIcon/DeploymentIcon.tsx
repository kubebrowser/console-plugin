import * as React from "react";
import { Badge, BadgeProps } from "@patternfly/react-core";

export const deploymentBadgeText = "D";
export const deploymentBadgeColor = "#004080";

export function DeploymentIcon(props: BadgeProps) {
  return (
    <Badge {...props} style={{ backgroundColor: deploymentBadgeColor }}>
      {deploymentBadgeText}
    </Badge>
  );
}

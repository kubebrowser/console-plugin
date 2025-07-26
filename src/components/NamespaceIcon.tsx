import * as React from 'react';
import { Badge, BadgeProps } from '@patternfly/react-core';

export const namespaceBadgeText = 'NS';
export const namespaceBadgeColor = 'var(--pf-v5-global--palette--green-500)';

export function NamespaceIcon(props: BadgeProps) {
  return (
    <Badge {...props} style={{ backgroundColor: namespaceBadgeColor }}>
      {namespaceBadgeText}
    </Badge>
  );
}

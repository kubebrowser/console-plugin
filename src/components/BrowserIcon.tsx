import * as React from 'react';
import { Badge, BadgeProps } from '@patternfly/react-core';

export const browserBadgeText = 'BR';
export const browserBadgeColor = 'var(--pf-v5-global--palette--light-blue-400)';

export function BrowserIcon(props: BadgeProps) {
  return (
    <Badge {...props} style={{ backgroundColor: browserBadgeColor, ...props.style }}>
      {browserBadgeText}
    </Badge>
  );
}

import { EmptyState, EmptyStateBody, EmptyStateFooter } from '@patternfly/react-core';
import { BlueprintIcon } from '@patternfly/react-icons';
import * as React from 'react';

export const NoBrowserState = () => {
  return (
    <EmptyState titleText="Nothing to render" headingLevel="h4" icon={BlueprintIcon} isFullHeight>
      <EmptyStateBody>Select a Browser.</EmptyStateBody>
      <EmptyStateFooter></EmptyStateFooter>
    </EmptyState>
  );
};

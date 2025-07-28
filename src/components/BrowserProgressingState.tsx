import * as React from 'react';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { InProgressIcon } from '@patternfly/react-icons';

export const BrowserProgressingState: React.FC<{ specStarted: boolean }> = ({ specStarted }) => {
  return (
    <EmptyState
      titleText={specStarted ? 'Browser is starting' : 'Browser is stopping'}
      headingLevel="h4"
      color="red"
      status="warning"
      icon={InProgressIcon}
      isFullHeight
    >
      <EmptyStateBody>
        {specStarted
          ? 'Waiting for browser deployment to be ready.'
          : 'Terminating browser deployment.'}
      </EmptyStateBody>
    </EmptyState>
  );
};

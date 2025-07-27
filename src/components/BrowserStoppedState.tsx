import * as React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { OffIcon } from '@patternfly/react-icons';

export const BrowserStoppedState = () => {
  return (
    <EmptyState titleText="Browser is Stopped" headingLevel="h4" icon={OffIcon} isFullHeight>
      <EmptyStateBody>Turn on browser to use it.</EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="primary">Start Browser</Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

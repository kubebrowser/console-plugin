import * as React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { OffIcon } from '@patternfly/react-icons';
import { k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import { BrowserModel } from '../utils/models';

export const BrowserStoppedState: React.FC<{ browserName: string; browserNamespace: string }> = ({
  browserName,
  browserNamespace,
}) => {
  async function startBrowser() {
    try {
      await k8sPatch({
        data: [
          {
            op: 'replace',
            path: '/spec/started',
            value: true,
          },
        ],
        model: BrowserModel,
        resource: {
          apiVersion: BrowserModel.apiGroup + '/' + BrowserModel.apiVersion,
          kind: BrowserModel.kind,
          metadata: { name: browserName, namespace: browserNamespace },
        },
      });
    } catch (err) {
      console.log('Failed to edit browser ', err);
    }
  }
  return (
    <EmptyState titleText="Browser is Stopped" headingLevel="h4" icon={OffIcon} isFullHeight>
      <EmptyStateBody>Turn on browser to use it.</EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="primary" onClick={startBrowser}>
            Start Browser
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

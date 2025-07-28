import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import * as React from 'react';
import { K8sBrowser } from '../types/browser';
import { BrowserActions } from './BrowserActions';
import { BrowserSelector } from './BrowserSelector';
import { NamespaceSelector } from './NamespaceSelector';

export const SelectorToolbar: React.FC<{
  namespace: string;
  onNamespaceChange: (newNamespace: string) => void;
  browser: K8sBrowser;
  onBrowserChange: (newBrowser: K8sBrowser) => void;
  toggleBrowserDrawer: () => void;
}> = ({ namespace, onNamespaceChange, browser, onBrowserChange, toggleBrowserDrawer }) => {
  return (
    <Toolbar style={{ padding: 16 }}>
      <ToolbarContent alignItems="center">
        <ToolbarGroup>
          <Breadcrumb>
            <BreadcrumbItem isDropdown>
              <NamespaceSelector value={namespace} onValueChange={onNamespaceChange} />
            </BreadcrumbItem>
            <BreadcrumbItem isDropdown>
              <BrowserSelector
                namespace={namespace}
                resourceVersion={browser?.metadata?.resourceVersion}
                value={browser?.metadata?.name}
                onValueChange={onBrowserChange}
              />
            </BreadcrumbItem>
          </Breadcrumb>
        </ToolbarGroup>
        <ToolbarGroup align={{ default: 'alignEnd' }}>
          <BrowserActions
            browserName={browser?.metadata?.name}
            browserNamespace={browser?.metadata?.namespace}
            specStarted={browser?.spec?.started}
            statusDeploymentStatus={browser?.status?.deploymentStatus}
            toggleBrowserDrawer={toggleBrowserDrawer}
          />
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

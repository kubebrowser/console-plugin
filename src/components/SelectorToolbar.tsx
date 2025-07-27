import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
} from '@patternfly/react-core';
import { NamespaceSelector } from './NamespaceSelector';
import { BrowserSelector } from './BrowserSelector';
import { BrowserActions } from './BrowserActions';
import { K8sBrowser } from '../types/browser';

export const SelectorToolbar: React.FC<{
  namespace: string;
  onNamespaceChange: (newNamespace: string) => void;
  browser: K8sBrowser;
  onBrowserChange: (newBrowser: K8sBrowser) => void;
  toggleBrowserDrawer: () => void;
}> = ({ namespace, onNamespaceChange, browser, onBrowserChange, toggleBrowserDrawer }) => {
  return (
    <Toolbar>
      <ToolbarContent alignItems="center">
        <ToolbarGroup>
          <Breadcrumb>
            <BreadcrumbItem isDropdown>
              <NamespaceSelector value={namespace} onValueChange={onNamespaceChange} />
            </BreadcrumbItem>
            <BreadcrumbItem isDropdown>
              <BrowserSelector
                namespace={namespace}
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

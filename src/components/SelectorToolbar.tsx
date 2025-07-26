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

export const SelectorToolbar: React.FC<{
  namespace: string;
  onNamespaceChange: (newNamespace: string) => void;
  browser: string;
  onBrowserChange: (newBrowser: string) => void;
}> = ({ namespace, onNamespaceChange, browser, onBrowserChange }) => {
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarGroup>
          <Breadcrumb>
            <BreadcrumbItem isDropdown>
              <NamespaceSelector value={namespace} onValueChange={onNamespaceChange} />
            </BreadcrumbItem>
            <BreadcrumbItem isDropdown>
              <BrowserSelector
                namespace={namespace}
                value={browser}
                onValueChange={onBrowserChange}
              />
            </BreadcrumbItem>
          </Breadcrumb>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

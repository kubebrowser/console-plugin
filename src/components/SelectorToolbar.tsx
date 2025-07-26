import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
} from '@patternfly/react-core';
import { NamespaceSelector } from './NamespaceSelector';

export const SelectorToolbar: React.FC<{
  namespace: string;
  onNamespaceChange: (newNamespace: string) => void;
}> = ({ namespace, onNamespaceChange }) => {
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarGroup>
          <Breadcrumb>
            <BreadcrumbItem isDropdown>
              <NamespaceSelector value={namespace} onValueChange={onNamespaceChange} />
            </BreadcrumbItem>
          </Breadcrumb>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

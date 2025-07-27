import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ActionList,
  ActionListGroup,
  ActionListItem,
  Button,
  TextInput,
} from '@patternfly/react-core';
import { ChevronLeftIcon, ChevronRightIcon, UndoIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { K8sBrowser } from 'src/types/browser';

export const BrowserControlToolbar: React.FC<{ browser: K8sBrowser }> = ({ browser }) => {
  const [isHovered, setHovered] = React.useState(false);
  const isDisabled = browser.status.deploymentStatus !== 'Ready';

  function onMouseEnter() {
    setHovered(true);
  }

  function onMouseLeave() {
    setHovered(false);
  }

  return (
    <Toolbar
      style={{ padding: 16, opacity: isDisabled || isHovered ? 1 : '0.5' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ToolbarContent>
        <ToolbarGroup align={{ default: 'alignStart' }}>
          <ActionList>
            <ActionListGroup>
              <ActionListItem>
                <Button isDisabled={isDisabled} icon={<ChevronLeftIcon />} variant="control" />
              </ActionListItem>
              <ActionListItem>
                <Button isDisabled={isDisabled} icon={<ChevronRightIcon />} variant="control" />
              </ActionListItem>
              <ActionListItem>
                <Button isDisabled={isDisabled} icon={<UndoIcon />} variant="control" />
              </ActionListItem>
            </ActionListGroup>
          </ActionList>
        </ToolbarGroup>
        <ToolbarGroup align={{ default: 'alignEnd' }}>
          <ActionList>
            <ActionListGroup>
              <ActionListItem>
                <TextInput
                  placeholder="http://myserver.svc.cluster.local:8080"
                  style={{ width: '300px' }}
                  isDisabled={isDisabled}
                />
              </ActionListItem>

              <ActionListItem>
                <Button isDisabled={isDisabled} variant="control">
                  Go
                </Button>
              </ActionListItem>
            </ActionListGroup>
          </ActionList>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

import * as React from 'react';
import { Button, Flex } from '@patternfly/react-core';
import { FC } from 'react';
import { InfoCircleIcon } from '@patternfly/react-icons';

export const BrowserActions: FC<{
  browserName?: string;
  browserNamespace?: string;
  specStarted?: boolean;
  statusDeploymentStatus?: string;
  toggleBrowserDrawer?: () => void;
}> = ({ browserName, specStarted, toggleBrowserDrawer }) => {
  return (
    <Flex columnGap={{ default: 'columnGapSm' }}>
      <Button
        variant="secondary"
        ouiaId="Primary"
        isDisabled={!browserName || specStarted !== false} // this is so that even undefined causes disabled
      >
        Stop
      </Button>
      <Button
        variant="secondary"
        ouiaId="Primary"
        isDisabled={!browserName || specStarted !== true} // this is so that even undefined causes disabled
      >
        Start
      </Button>
      <Button
        icon={<InfoCircleIcon />}
        variant="secondary"
        isDisabled={!browserName}
        onClick={toggleBrowserDrawer}
      />
    </Flex>
  );
};

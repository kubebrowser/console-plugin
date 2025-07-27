import * as React from 'react';
import { Button, Flex } from '@patternfly/react-core';
import { FC } from 'react';

export const BrowserActions: FC<{}> = () => {
  return (
    <Flex columnGap={{ default: 'columnGapSm' }}>
      <Button variant="secondary" ouiaId="Primary">
        Stop
      </Button>
      <Button variant="secondary" ouiaId="Primary">
        Start
      </Button>
    </Flex>
  );
};

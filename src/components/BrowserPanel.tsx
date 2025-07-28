import {
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelDescription,
  DrawerPanelBody,
  Tab,
  Tabs,
  TabTitleText,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import * as React from 'react';
import { FC } from 'react';
import { K8sBrowser } from 'src/types/browser';
import { BrowserDetails } from './BrowserDetails';
import { BrowserActionMenu } from './BrowserActionMenu';
import { BrowserIcon } from './BrowserIcon';
import { BrowserYaml } from './BrowserYaml';

export const BrowserPanel: FC<{
  browser: K8sBrowser;
  onClose: () => void;
  onBrowserDelete: () => void;
}> = ({ browser, onClose, onBrowserDelete }) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (
    _: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    setActiveTabKey(tabIndex);
  };

  // function handleDelete() {}

  return (
    <DrawerPanelContent isResizable>
      <DrawerHead>
        <DrawerActions>
          <DrawerCloseButton onClick={onClose} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelDescription>
        <Flex
          flexWrap={{ default: 'nowrap' }}
          alignItems={{ default: 'alignItemsCenter' }}
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
        >
          <FlexItem>
            <Flex
              alignSelf={{ default: 'alignSelfCenter' }}
              alignItems={{ default: 'alignItemsCenter' }}
              flexWrap={{ default: 'nowrap' }}
            >
              <FlexItem spacer={{ default: 'spacerSm' }} alignSelf={{ default: 'alignSelfCenter' }}>
                <BrowserIcon style={{ fontSize: 20 }} />
              </FlexItem>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{browser.metadata.name}</span>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <BrowserActionMenu onDelete={onBrowserDelete} />
          </FlexItem>
        </Flex>
      </DrawerPanelDescription>
      <DrawerPanelBody>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Tabs in the default example"
          role="region"
        >
          <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
            <BrowserDetails browser={browser} />
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>JSON (read-only)</TabTitleText>}>
            <BrowserYaml browser={browser} />
          </Tab>
        </Tabs>
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};

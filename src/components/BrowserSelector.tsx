import * as React from 'react';
import useSelectToggle from '../hooks/useSelectToggle';
import {
  MenuSearch,
  MenuSearchInput,
  SearchInput,
  Select,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleElement,
  SelectOption,
  SelectList,
  MenuFooter,
  Button,
} from '@patternfly/react-core';

import { useMemo } from 'react';
import useBrowsers from '../hooks/useBrowsers';
import { BrowserIcon } from './BrowserIcon';
import { useModal } from '@openshift-console/dynamic-plugin-sdk';
import { CreateBrowserModal } from './CreateBrowserModal';
import { K8sBrowser } from 'src/types/browser';
import { BrowserStatusIndicator } from './BrowserStatusIcon';

export const BrowserSelector: React.FC<{
  namespace: string;
  value: string;
  onValueChange: (newValue: K8sBrowser) => void;
}> = ({ namespace, value, onValueChange }) => {
  const [input, setInput] = React.useState('');

  const { isOpen, toggleSelect } = useSelectToggle();
  const { browsers, isLoading: browsersLoading } = useBrowsers(namespace);
  const launchModal = useModal();

  function launchCreateBrowser() {
    toggleSelect(false);
    launchModal(CreateBrowserModal, {});
  }
  const handleTextInputChange = (value: string) => {
    setInput(value);
  };

  const onBrowserSelect = (_?: React.MouseEvent, itemId?: string | number) => {
    if (!itemId) return;
    toggleSelect(false);
    onValueChange(browsers.find((br) => br.metadata.name === itemId));
  };

  const filteredDeploymentSelectMenuItems = useMemo(() => {
    const browserSelectMenuItems = browsers
      .filter((browser) =>
        browser.metadata.name.toLowerCase().includes(input.toString().toLowerCase()),
      )
      .map((browser) => {
        const itemId = browser.metadata.name;
        const status = browser.status.deploymentStatus;
        return (
          <SelectOption key={itemId} itemId={itemId} isSelected={value === itemId}>
            <span>
              <BrowserIcon />
              <span className="pf-v5-u-mx-xs" data-testid="browser-name">
                {itemId}
              </span>
              <BrowserStatusIndicator status={status} />
            </span>
          </SelectOption>
        );
      });

    return browserSelectMenuItems;
  }, [browsers, input]);

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => toggleSelect(!isOpen)}
      isDisabled={browsersLoading}
      isExpanded={isOpen}
      style={
        {
          width: '275px',
        } as React.CSSProperties
      }
    >
      <Flex alignSelf={{ default: 'alignSelfCenter' }} flexWrap={{ default: 'nowrap' }}>
        <FlexItem spacer={{ default: 'spacerSm' }} alignSelf={{ default: 'alignSelfCenter' }}>
          <BrowserIcon />
        </FlexItem>
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <span style={{ position: 'relative', top: '1px', opacity: !value ? '0.5' : undefined }}>
            {value || (browsersLoading ? 'Loading Browsers' : 'Select Browser')}
          </span>
        </FlexItem>
        {value && (
          <FlexItem spacer={{ default: 'spacerSm' }} alignSelf={{ default: 'alignSelfCenter' }}>
            <BrowserStatusIndicator
              status={browsers.find((br) => br.metadata.name === value)?.status.deploymentStatus}
            />
          </FlexItem>
        )}
      </Flex>
    </MenuToggle>
  );

  return (
    <Select
      id="option-variations-select"
      isOpen={isOpen}
      selected={value}
      onSelect={onBrowserSelect}
      onOpenChange={(isOpen) => toggleSelect(isOpen)}
      toggle={toggle}
      shouldFocusToggleOnSelect
      isScrollable
    >
      <MenuSearch>
        <MenuSearchInput>
          <SearchInput
            value={input}
            aria-label="Filter browser"
            type="search"
            placeholder="Filter browsers..."
            onChange={(_event, value) => handleTextInputChange(value)}
          />
        </MenuSearchInput>
      </MenuSearch>
      <SelectList>{filteredDeploymentSelectMenuItems}</SelectList>
      <MenuFooter>
        <Button variant="secondary" onClick={launchCreateBrowser}>
          New Browser
        </Button>
      </MenuFooter>
    </Select>
  );
};

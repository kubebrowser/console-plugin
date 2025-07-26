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

export const BrowserSelector: React.FC<{
  namespace: string;
  value: string;
  onValueChange: (newValue: string) => void;
}> = ({ namespace, value, onValueChange }) => {
  const [input, setInput] = React.useState('');

  const { isOpen, toggleSelect } = useSelectToggle();
  const { browsers, isLoading: browsersLoading } = useBrowsers(namespace);

  const handleTextInputChange = (value: string) => {
    setInput(value);
  };

  const onBrowserSelect = (_?: React.MouseEvent, itemId?: string | number) => {
    if (!itemId) return;
    toggleSelect(false);
    onValueChange(itemId as string);
  };

  const filteredDeploymentSelectMenuItems = useMemo(() => {
    const browserSelectMenuItems = browsers
      .filter((browser) => browser.toLowerCase().includes(input.toString().toLowerCase()))
      .map((browser) => {
        return (
          <SelectOption key={browser} itemId={browser} isSelected={value === browser}>
            <span>
              <BrowserIcon />
              <span className="pf-v5-u-mx-xs" data-testid="browser-name">
                {browser}
              </span>
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
        <Button variant="secondary">New Browser</Button>
      </MenuFooter>
    </Select>
  );
};

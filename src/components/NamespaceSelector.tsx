import * as React from 'react';
import useSelectToggle from '../hooks/useSelectToggle';
import {
  Menu,
  MenuSearch,
  MenuSearchInput,
  SearchInput,
  Divider,
  Select,
  MenuContent,
  MenuList,
  MenuItem,
  Button,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleElement,
  SelectOption,
  SelectList,
} from '@patternfly/react-core';

import { NamespaceIcon } from './NamespaceIcon';
import { useMemo } from 'react';
import useNamespaces from '../hooks/useNamespaces';

export const NamespaceSelector: React.FC<{
  value: string;
  onValueChange: (newValue: string) => void;
}> = ({ value, onValueChange }) => {
  const [input, setInput] = React.useState('');

  const { isOpen, toggleSelect } = useSelectToggle();
  const { namespaces, isLoading: namespacesLoading } = useNamespaces();

  const handleTextInputChange = (value: string) => {
    setInput(value);
  };

  const onNamespaceSelect = (_?: React.MouseEvent, itemId?: string | number) => {
    if (!itemId) return;
    toggleSelect(false);
    onValueChange(itemId as string);
  };

  const filteredDeploymentSelectMenuItems = useMemo(() => {
    const namespaceSelectMenuItems = namespaces
      .filter((namespace) => namespace.toLowerCase().includes(input.toString().toLowerCase()))
      .map((namespace) => {
        return (
          <SelectOption key={namespace} itemId={namespace} isSelected={value === namespace}>
            <span>
              <NamespaceIcon />
              <span className="pf-v5-u-mx-xs" data-testid="namespace-name">
                {namespace}
              </span>
            </span>
          </SelectOption>
        );
      });

    return namespaceSelectMenuItems;
  }, [namespaces, input]);

  // @ts-ignore
  const namespaceSelectMenu = (
    <Menu onSelect={onNamespaceSelect} selected={value} isScrollable>
      <MenuSearch>
        <MenuSearchInput>
          <SearchInput
            value={input}
            aria-label="Filter namespaces"
            type="search"
            placeholder="Filter namespaces..."
            onChange={(_event, value) => handleTextInputChange(value)}
          />
        </MenuSearchInput>
      </MenuSearch>
      <Divider className="pf-v5-u-m-0" />
      <MenuContent>
        <MenuList>
          {filteredDeploymentSelectMenuItems.length === 0 && (
            <MenuItem isDisabled key="no result">
              No namespaces found
            </MenuItem>
          )}
          {filteredDeploymentSelectMenuItems}
        </MenuList>
      </MenuContent>
    </Menu>
  );
  // @ts-ignore
  const namespaceToggle = (
    <Button>
      <Flex alignSelf={{ default: 'alignSelfCenter' }}>
        <FlexItem spacer={{ default: 'spacerSm' }} alignSelf={{ default: 'alignSelfCenter' }}>
          <NamespaceIcon />
        </FlexItem>
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <span style={{ position: 'relative', top: '1px' }}>Namespaces</span>
        </FlexItem>
      </Flex>
    </Button>
  );

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => toggleSelect(!isOpen)}
      isDisabled={namespacesLoading}
      isExpanded={isOpen}
      style={
        {
          width: '275px',
        } as React.CSSProperties
      }
    >
      <Flex alignSelf={{ default: 'alignSelfCenter' }} flexWrap={{ default: 'nowrap' }}>
        <FlexItem spacer={{ default: 'spacerSm' }} alignSelf={{ default: 'alignSelfCenter' }}>
          <NamespaceIcon />
        </FlexItem>
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <span style={{ position: 'relative', top: '1px' }}>
            {value || (namespacesLoading ? 'Loading Namespaces' : 'Select Namespace')}
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
      onSelect={onNamespaceSelect}
      onOpenChange={(isOpen) => toggleSelect(isOpen)}
      toggle={toggle}
      shouldFocusToggleOnSelect
      isScrollable
    >
      <SelectList>
        {/* menu should be fixed outside of scroll */}
        <MenuSearch>
          <MenuSearchInput>
            <SearchInput
              value={input}
              aria-label="Filter namespaces"
              type="search"
              placeholder="Filter namespaces..."
              onChange={(_event, value) => handleTextInputChange(value)}
            />
          </MenuSearchInput>
        </MenuSearch>

        {filteredDeploymentSelectMenuItems}
      </SelectList>
    </Select>
  );
};

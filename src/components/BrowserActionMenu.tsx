import * as React from 'react';
import { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';

export const BrowserActionMenu: React.FunctionComponent<{ onDelete: () => void }> = ({
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined,
  ) => {
    // eslint-disable-next-line no-console
    console.log('selected', value);
    setIsOpen(false);
  };

  function onPromptDelete() {
    onDelete();
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
          Actions
        </MenuToggle>
      )}
      ouiaId="BasicDropdown"
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        <DropdownItem isDanger onClick={onPromptDelete}>
          Delete browser
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

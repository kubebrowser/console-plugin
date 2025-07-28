import * as React from 'react';
import { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { K8sBrowser } from '../types/browser';
import { useDeleteModal } from '@openshift-console/dynamic-plugin-sdk';

export const BrowserActionMenu: React.FunctionComponent<{ browser: K8sBrowser }> = ({
  browser,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const promptDelete = useDeleteModal(browser);

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
    switch (value) {
      case 'delete':
        onDelete();
        break;
      default:
        break;
    }
  };

  function onDelete() {
    promptDelete();
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
        <DropdownItem isDanger value="delete">
          Delete browser
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

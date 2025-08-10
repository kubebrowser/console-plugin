import * as React from "react";
import useSelectToggle from "../../hooks/useSelectToggle";
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
  Button
} from "@patternfly/react-core";

import useBrowsers from "../../hooks/useBrowsers";
import { BrowserIcon } from "../ResourceIcon/BrowserIcon";
import { useModal } from "@openshift-console/dynamic-plugin-sdk";
import { CreateBrowserModal } from "../CreateBrowserModal/CreateBrowserModal";
import { K8sBrowser } from "../../types/browser";
import { BrowserStatusIndicator } from "../BrowserStatusIndicator/BrowserStatusIndicator";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const BrowserSelector: React.FC<{
  namespace: string;
  value?: string;
  resourceVersion?: string;
  onValueChange: (newValue: K8sBrowser | undefined) => void;
}> = ({ namespace, value, resourceVersion, onValueChange }) => {
  const [input, setInput] = React.useState("");

  const { isOpen, toggleSelect } = useSelectToggle();
  const { browsers, isLoading: browsersLoading } = useBrowsers(namespace); // handle error
  const launchModal = useModal();

  const { t } = useTranslation();

  React.useEffect(() => {
    if (!value) return;
    const selectedBrowser = browsers.find((br) => br.metadata.name === value);

    if (selectedBrowser && selectedBrowser.metadata.resourceVersion === resourceVersion) return;
    // selected browser is no longer among the list of browsers
    // or
    // selected value resourceVersionc changed

    onValueChange(selectedBrowser);
  }, [browsers.map((br) => br.metadata.name! + br.metadata.resourceVersion!).join(",")]);

  const filteredDeploymentSelectMenuItems = useMemo(() => {
    const browserSelectMenuItems = browsers
      .filter((browser) =>
        browser.metadata.name!.toLowerCase().includes(input.toString().toLowerCase())
      )
      .map((browser) => {
        const itemId = browser.metadata.name;
        const status = browser.status?.deploymentStatus;
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
  }, [browsers, input, value]);

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
    onValueChange(
      value !== itemId ? browsers.find((br) => br.metadata.name === itemId) : undefined
    );
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => toggleSelect(!isOpen)}
      isDisabled={browsersLoading || !namespace}
      isExpanded={isOpen}
      style={
        {
          width: "275px"
        } as React.CSSProperties
      }
    >
      <Flex alignSelf={{ default: "alignSelfCenter" }} flexWrap={{ default: "nowrap" }}>
        <FlexItem spacer={{ default: "spacerSm" }} alignSelf={{ default: "alignSelfCenter" }}>
          <BrowserIcon />
        </FlexItem>
        <FlexItem spacer={{ default: "spacerSm" }}>
          <span style={{ position: "relative", top: "1px", opacity: !value ? "0.5" : undefined }}>
            {value || (browsersLoading ? t("Loading Browsers") : t("Select Browser"))}
          </span>
        </FlexItem>
        {value && (
          <FlexItem spacer={{ default: "spacerSm" }} alignSelf={{ default: "alignSelfCenter" }}>
            <BrowserStatusIndicator
              status={browsers.find((br) => br.metadata.name === value)?.status?.deploymentStatus}
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
            placeholder={t("Filter browsers") + "..."}
            onChange={(_event, value) => handleTextInputChange(value)}
          />
        </MenuSearchInput>
      </MenuSearch>
      <SelectList>{filteredDeploymentSelectMenuItems}</SelectList>
      <MenuFooter>
        <Button variant="secondary" onClick={launchCreateBrowser}>
          {t("New Browser")}
        </Button>
      </MenuFooter>
    </Select>
  );
};

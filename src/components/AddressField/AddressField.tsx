import * as React from "react";
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  Spinner,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities
} from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { useServiceSuggestions } from "../../hooks/useServiceSuggestions";
import {
  ALL_NAMESPACES_ROW,
  MENU_ID,
  NAMESPACE_ROW_PREFIX,
  SEARCH_ALL_ROW,
  TYPED_URL_ROW,
  buildSuggestionView,
  optionId
} from "../../utils/suggestionView";
import { normalizeUrl } from "../../utils/url";
import { SuggestionMenu } from "../SuggestionMenu/SuggestionMenu";

// The URL field, with a menu of Services to open while it has focus.
export const AddressField: React.FC<{
  browserNamespace?: string;
  // The remote page's URL; shown whenever it changes while the field isn't focused.
  currentUrl?: string;
  placeholder: string;
  isDisabled: boolean;
  isNavigating: boolean;
  onNavigate: (url: string) => void;
}> = ({ browserNamespace, currentUrl, placeholder, isDisabled, isNavigating, onNavigate }) => {
  const { t } = usePluginTranslation();
  const [urlInput, setUrlInput] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFiltering, setIsFiltering] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // The namespace whose Services are listed; undefined means "All namespaces".
  const [viewNamespace, setViewNamespace] = React.useState<string | undefined>(browserNamespace);
  React.useEffect(() => setViewNamespace(browserNamespace), [browserNamespace]);
  const services = useServiceSuggestions(viewNamespace, browserNamespace);

  // Don't replace what the user is typing.
  React.useEffect(() => {
    if (currentUrl === undefined || document.activeElement === inputRef.current) return;
    setUrlInput(currentUrl);
    setIsFiltering(false);
  }, [currentUrl]);

  const query = isFiltering ? urlInput.trim() : "";
  const view = React.useMemo(
    () =>
      buildSuggestionView({
        query,
        namespace: viewNamespace,
        canListClusterWide: services.canListClusterWide,
        suggestions: services.suggestions,
        namespaces: services.namespaces
      }),
    [query, viewNamespace, services.canListClusterWide, services.suggestions, services.namespaces]
  );
  const { rows } = view;
  const focusedValue = focusedIndex >= 0 ? rows[focusedIndex] : undefined;

  function closeMenu() {
    setIsOpen(false);
    setFocusedIndex(-1);
  }

  function openMenu() {
    if (isDisabled) return;
    setIsFiltering(false);
    setFocusedIndex(-1);
    setIsOpen(true);
  }

  function navigateTo(url: string) {
    setUrlInput(url);
    closeMenu();
    inputRef.current?.blur();
    onNavigate(url);
  }

  function navigateToTyped() {
    const input = urlInput.trim();
    if (!input) return;
    navigateTo(normalizeUrl(input));
  }

  // Switch the listed namespace without closing the menu or losing the input focus.
  function showNamespace(ns: string | undefined, keepQuery: boolean) {
    setViewNamespace(ns);
    setFocusedIndex(-1);
    if (!keepQuery && isFiltering) {
      setUrlInput("");
      setIsFiltering(false);
    }
    inputRef.current?.focus();
  }

  function pick(value: string) {
    if (value === TYPED_URL_ROW) return navigateToTyped();
    if (value === ALL_NAMESPACES_ROW) return showNamespace(undefined, false);
    if (value === SEARCH_ALL_ROW) return showNamespace(undefined, true);
    if (value.startsWith(NAMESPACE_ROW_PREFIX)) {
      return showNamespace(value.slice(NAMESPACE_ROW_PREFIX.length), false);
    }
    const suggestion = services.suggestions.find((s) => s.id === value);
    if (suggestion) navigateTo(suggestion.url);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        // Only a row the user moved to is used; otherwise go where the text says.
        if (isOpen && focusedIndex >= 0) pick(rows[focusedIndex]);
        else navigateToTyped();
        break;
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!isOpen) {
          openMenu();
          return;
        }
        if (!rows.length) return;
        // Cycle through -1 (the input itself) and every row, like an omnibox.
        const size = rows.length + 1;
        const step = e.key === "ArrowDown" ? 1 : -1;
        setFocusedIndex((i) => ((i + 1 + step + size) % size) - 1);
        break;
      }
      case "Escape":
      case "Tab":
        closeMenu();
        break;
    }
  }

  // Filtering can shrink the list under the focused row.
  React.useEffect(() => {
    if (focusedIndex >= rows.length) setFocusedIndex(-1);
  }, [focusedIndex, rows.length]);

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      isFullWidth
      isExpanded={isOpen}
      isDisabled={isDisabled}
      onClick={() => (isOpen ? closeMenu() : openMenu())}
      aria-label={t("Show Services")}
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          ref={inputRef}
          value={urlInput}
          placeholder={placeholder}
          inputId="browser-url-input"
          aria-label={t("URL")}
          role="combobox"
          isExpanded={isOpen}
          aria-controls={MENU_ID}
          {...(focusedValue ? { "aria-activedescendant": optionId(focusedValue) } : {})}
          autoComplete="off"
          onFocus={() => !isOpen && openMenu()}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOpen) openMenu();
          }}
          onChange={(_e, value) => {
            setUrlInput(value);
            setIsFiltering(true);
            setFocusedIndex(-1);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {isNavigating && (
          <TextInputGroupUtilities>
            <Spinner size="sm" aria-label={t("Loading")} />
          </TextInputGroupUtilities>
        )}
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      id={MENU_ID}
      // Keep the focus in the input on Up/Down; onKeyDown moves the highlighted row.
      variant="typeahead"
      isOpen={isOpen}
      onSelect={(_e, value) => value && pick(String(value))}
      onOpenChange={(open) => !open && closeMenu()}
      toggle={toggle}
      shouldFocusToggleOnSelect={false}
      shouldFocusFirstItemOnOpen={false}
      popperProps={{ width: "trigger" }}
    >
      {/* Switching namespaces swaps out the clicked row; stop the click from reaching
          Select's outside-click check, which would no longer find it in the menu. */}
      <div style={{ maxHeight: 420, overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <SuggestionMenu
          view={view}
          browserNamespace={browserNamespace}
          loaded={services.loaded}
          loadError={services.loadError}
          focusedValue={focusedValue}
          onPick={pick}
        />
      </div>
    </Select>
  );
};

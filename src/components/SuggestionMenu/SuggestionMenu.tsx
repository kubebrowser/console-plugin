import * as React from "react";
import { Divider, SelectList, SelectOption } from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import {
  ALL_NAMESPACES_ROW,
  MAX_ROWS,
  SEARCH_ALL_ROW,
  SuggestionView,
  TYPED_URL_ROW,
  optionId
} from "../../utils/suggestionView";
import { normalizeUrl } from "../../utils/url";
import { NamespaceList } from "./NamespaceList";
import { ScopeBreadcrumb } from "./ScopeBreadcrumb";
import { ServiceList } from "./ServiceList";
import { SuggestionsLoadError } from "./SuggestionsLoadError";
import { SuggestionsLoading } from "./SuggestionsLoading";

// The body of the address bar's menu: the typed URL, the scope breadcrumb, then
// namespaces and Services (or their loading and error states).
export const SuggestionMenu: React.FC<{
  view: SuggestionView;
  browserNamespace?: string;
  loaded: boolean;
  loadError: unknown;
  focusedValue?: string;
  onPick: (value: string) => void;
}> = ({ view, browserNamespace, loaded, loadError, focusedValue, onPick }) => {
  const { t } = usePluginTranslation();
  const { query, namespace } = view;
  const isAllNamespaces = !namespace;
  const showNamespaceList = isAllNamespaces && !query;
  const isEmpty = !showNamespaceList && !view.services.length && !view.namespaces.length;

  return (
    <>
      {query && (
        <>
          <SelectList>
            <SelectOption
              value={TYPED_URL_ROW}
              id={optionId(TYPED_URL_ROW)}
              isFocused={focusedValue === TYPED_URL_ROW}
              description={t("Open the URL as typed")}
            >
              {normalizeUrl(query)}
            </SelectOption>
          </SelectList>
          <Divider />
        </>
      )}
      <ScopeBreadcrumb
        namespace={namespace}
        canGoUp={!isAllNamespaces && view.canListClusterWide}
        isFocused={focusedValue === ALL_NAMESPACES_ROW}
        onGoUp={() => onPick(ALL_NAMESPACES_ROW)}
      />
      {loadError ? (
        <SuggestionsLoadError error={loadError} namespace={namespace} />
      ) : !loaded ? (
        <SuggestionsLoading />
      ) : (
        <>
          <NamespaceList
            namespaces={view.namespaces}
            browserNamespace={browserNamespace}
            isGrouped={!!query}
            focusedValue={focusedValue}
          />
          <ServiceList
            services={view.services}
            showNamespaceLabels={isAllNamespaces}
            hasContentAbove={view.namespaces.length > 0}
            focusedValue={focusedValue}
          />
          {isEmpty && (
            <SelectList>
              <SelectOption isDisabled value="__empty__">
                {query
                  ? t("No matching Services")
                  : isAllNamespaces
                    ? t("No Services found")
                    : t("No Services in this namespace")}
              </SelectOption>
            </SelectList>
          )}
          {view.offerSearchAll && (
            <SelectList>
              <SelectOption
                value={SEARCH_ALL_ROW}
                id={optionId(SEARCH_ALL_ROW)}
                isFocused={focusedValue === SEARCH_ALL_ROW}
              >
                {t('Search all namespaces for "{{query}}"', { query })}
              </SelectOption>
            </SelectList>
          )}
          {!showNamespaceList && view.matchCount > MAX_ROWS && (
            <SelectList>
              <SelectOption isDisabled value="__more__">
                {t("Showing {{shown}} of {{total}}. Type to narrow the list.", {
                  shown: MAX_ROWS,
                  total: view.matchCount
                })}
              </SelectOption>
            </SelectList>
          )}
        </>
      )}
    </>
  );
};

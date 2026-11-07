import * as React from "react";
import { Divider, SelectGroup, SelectList, SelectOption } from "@patternfly/react-core";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { ServiceSuggestion } from "../../hooks/useServiceSuggestions";
import {
  LoadError,
  LoadingRows,
  NamespaceOption,
  ScopeBreadcrumb,
  ServiceOption
} from "./SuggestionRows";
import {
  ALL_NAMESPACES_ROW,
  MAX_ROWS,
  NAMESPACE_ROW_PREFIX,
  SEARCH_ALL_ROW,
  SuggestionView,
  TYPED_URL_ROW,
  normalizeUrl,
  optionId
} from "./suggestionView";

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

  function renderNamespaces() {
    if (!view.namespaces.length) return null;
    const list = (
      <SelectList>
        {view.namespaces.map((ns) => (
          <NamespaceOption
            key={ns.name}
            namespace={ns}
            isBrowserNamespace={ns.name === browserNamespace}
            isFocused={focusedValue === NAMESPACE_ROW_PREFIX + ns.name}
          />
        ))}
      </SelectList>
    );
    // While searching, namespaces are one group among the Service results.
    return query ? <SelectGroup label={t("Namespaces")}>{list}</SelectGroup> : list;
  }

  function renderServices() {
    const groups = view.services.reduce<Record<string, ServiceSuggestion[]>>((acc, s) => {
      (acc[s.namespace] ||= []).push(s);
      return acc;
    }, {});
    return Object.entries(groups).map(([ns, items], i) => {
      const list = (
        <SelectList>
          {items.map((s) => (
            <ServiceOption key={s.id} service={s} isFocused={focusedValue === s.id} />
          ))}
        </SelectList>
      );
      return (
        <React.Fragment key={ns}>
          {(i > 0 || view.namespaces.length > 0) && <Divider />}
          {/* A single namespace is already named in the breadcrumb. */}
          {isAllNamespaces ? <SelectGroup label={ns}>{list}</SelectGroup> : list}
        </React.Fragment>
      );
    });
  }

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
        <LoadError error={loadError} namespace={namespace} />
      ) : !loaded ? (
        <LoadingRows />
      ) : (
        <>
          {renderNamespaces()}
          {renderServices()}
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

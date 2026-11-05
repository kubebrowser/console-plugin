import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Divider,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectGroup,
  SelectList,
  SelectOption,
  Skeleton,
  Spinner,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Tooltip
} from "@patternfly/react-core";
import { ArrowLeftIcon, ArrowRightIcon, RedoIcon } from "@patternfly/react-icons";
import * as React from "react";
import { consoleFetch } from "@openshift-console/dynamic-plugin-sdk";
import { K8sBrowser } from "../../types/browser";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";
import { NamespaceIcon } from "../ResourceIcon/NamespaceIcon";
import { ServiceIcon } from "../ResourceIcon/ServiceIcon";
import {
  ServiceSuggestion,
  filterSuggestions,
  useServiceSuggestions
} from "../../hooks/useServiceSuggestions";

enum ControlActions {
  navigate = "page-navigate",
  backward = "page-goback",
  forward = "page-goforward",
  reload = "page-reload"
}

const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;
const MAX_ROWS = 50;
const MENU_ID = "browser-url-suggestions";

// Values of the non-Service rows, so keyboard focus can move over them too.
const TYPED_URL_ROW = "__typed-url__";
const ALL_NAMESPACES_ROW = "__all-namespaces__";
const SEARCH_ALL_ROW = "__search-all__";
const NAMESPACE_ROW_PREFIX = "ns:";

// Mirror browser address bars: assume http:// when no scheme is typed.
function normalizeUrl(input: string): string {
  return SCHEME_PATTERN.test(input) ? input : `http://${input}`;
}

// consoleFetch errors only carry the HTTP status text; the browser API puts the
// actual reason in the (plain text) response body.
async function getErrorDetail(err: unknown): Promise<string | undefined> {
  const { response, json } = err as { response?: Response; json?: { message?: string } };
  if (json?.message) return json.message;
  if (response && !response.bodyUsed) {
    try {
      const text = (await response.text()).trim();
      if (text) return text;
    } catch {
      // Fall back to the error message below.
    }
  }
  return (err as Error)?.message;
}

// Watch errors are the console's HttpError: the API Status is in json, the HTTP code in response.
function getErrorStatus(err: unknown): number | undefined {
  const { json, response } = (err ?? {}) as {
    json?: { code?: number };
    response?: { status?: number };
  };
  return json?.code ?? response?.status;
}

function getErrorMessage(err: unknown): string {
  const { json, message } = (err ?? {}) as { json?: { message?: string }; message?: string };
  const text = json?.message || message || "Unknown error";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function optionId(value: string) {
  return `${MENU_ID}-${value.replace(/[^a-z0-9-]/gi, "-")}`;
}

export const BrowserControlToolbar: React.FC<{ browser?: K8sBrowser }> = ({ browser }) => {
  const { t } = usePluginTranslation();
  const [loadingAction, setLoadingAction] = React.useState<string | undefined>();
  const [actionError, setActionError] = React.useState<{ message: string; hint?: string }>();
  const [urlInput, setUrlInput] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFiltering, setIsFiltering] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isDisabled = !browser || browser.status?.deploymentStatus !== "Ready" || !!loadingAction;
  const browserNamespace = browser?.metadata.namespace;
  // The namespace whose Services are listed; undefined means "All namespaces".
  const [viewNamespace, setViewNamespace] = React.useState<string | undefined>(browserNamespace);
  React.useEffect(() => setViewNamespace(browserNamespace), [browserNamespace]);
  const services = useServiceSuggestions(viewNamespace, browserNamespace);
  const isAllNamespaces = !viewNamespace;

  const query = isFiltering ? urlInput.trim() : "";
  const matches = React.useMemo(
    () => filterSuggestions(services.suggestions, query),
    [services.suggestions, query]
  );
  // "All namespaces" with nothing typed lists namespaces; typing searches every Service.
  const showNamespaceList = isAllNamespaces && !query;
  const visibleNamespaces = isAllNamespaces
    ? services.namespaces.filter(
        (ns) => !query || ns.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  const visibleServices = showNamespaceList ? [] : matches.slice(0, MAX_ROWS);
  const offerSearchAll =
    !isAllNamespaces && !!query && matches.length === 0 && services.canListClusterWide;

  // Keyboard order follows the rendered order.
  const rows: string[] = [
    ...(query ? [TYPED_URL_ROW] : []),
    ...(!isAllNamespaces && services.canListClusterWide ? [ALL_NAMESPACES_ROW] : []),
    ...visibleNamespaces.map((ns) => NAMESPACE_ROW_PREFIX + ns.name),
    ...visibleServices.map((s) => s.id),
    ...(offerSearchAll ? [SEARCH_ALL_ROW] : [])
  ];
  const focusedValue = focusedIndex >= 0 ? rows[focusedIndex] : undefined;

  async function sendAction(args: { kind: string; url?: string }) {
    try {
      const url = `/api/kubernetes/apis/subresource.kubebrowser.io/v1alpha1/namespaces/${browser?.metadata.namespace}/browsers/${browser?.metadata.name}/action`;
      await consoleFetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args)
      });
      setActionError(undefined);
    } catch (err) {
      const message: string =
        (await getErrorDetail(err)) || t("An error occurred. Please try again.") || "";
      const isServiceUrl = !!args.url && /\.svc(\.cluster\.local)?(:\d+)?(\/|$)/.test(args.url);
      const hint =
        isServiceUrl && /timed.?out|timeout|refused|unreachable/i.test(message)
          ? t(
              "The browser couldn't reach this Service. A NetworkPolicy in its namespace may block traffic from the browser."
            )
          : undefined;
      setActionError({ message, hint });
    }
  }

  async function runAction(kind: ControlActions, url?: string) {
    if (loadingAction) return;
    setLoadingAction(kind);
    await sendAction({ kind, url });
    setLoadingAction(undefined);
  }

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
    runAction(ControlActions.navigate, url);
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

  function renderServiceOption(s: ServiceSuggestion) {
    return (
      <SelectOption
        key={s.id}
        value={s.id}
        id={optionId(s.id)}
        isFocused={focusedValue === s.id}
        icon={<ServiceIcon aria-hidden />}
        description={s.url}
      >
        <Flex spaceItems={{ default: "spaceItemsSm" }} alignItems={{ default: "alignItemsCenter" }}>
          <FlexItem>{s.name}</FlexItem>
          <FlexItem>
            <Label isCompact>
              {s.port}
              {s.portName ? ` · ${s.portName}` : ""}
            </Label>
          </FlexItem>
          {s.variant !== "ClusterIP" && (
            <FlexItem>
              <Tooltip
                content={
                  s.variant === "Headless"
                    ? t("Headless Service: no cluster IP, DNS resolves to the pods directly.")
                    : t("ExternalName Service: opens the external host it points to.")
                }
              >
                <Label isCompact variant="outline">
                  {s.variant === "Headless" ? t("Headless") : t("External")}
                </Label>
              </Tooltip>
            </FlexItem>
          )}
        </Flex>
      </SelectOption>
    );
  }

  // Breadcrumbs saying which namespace is listed, with the way up to all namespaces.
  function renderScopeHeader() {
    const isFocused = focusedValue === ALL_NAMESPACES_ROW;
    const canGoUp = !isAllNamespaces && services.canListClusterWide;
    return (
      <Breadcrumb
        aria-label={t("Service scope")}
        style={{ padding: "var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)" }}
      >
        {(isAllNamespaces || canGoUp) && (
          <BreadcrumbItem
            isActive={isAllNamespaces}
            render={
              canGoUp
                ? ({ className }) => (
                    <button
                      type="button"
                      id={optionId(ALL_NAMESPACES_ROW)}
                      className={className}
                      // Keep the focus in the input so typing keeps filtering.
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(ALL_NAMESPACES_ROW)}
                      style={
                        isFocused
                          ? {
                              outline:
                                "var(--pf-t--global--border--width--strong) solid var(--pf-t--global--border--color--clicked)",
                              outlineOffset: 2
                            }
                          : undefined
                      }
                    >
                      {t("All namespaces")}
                    </button>
                  )
                : undefined
            }
          >
            {!canGoUp && t("All namespaces")}
          </BreadcrumbItem>
        )}
        {!isAllNamespaces && (
          <BreadcrumbItem isActive>
            <Flex
              spaceItems={{ default: "spaceItemsSm" }}
              alignItems={{ default: "alignItemsCenter" }}
            >
              <NamespaceIcon />
              <span>{viewNamespace}</span>
            </Flex>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    );
  }

  function renderNamespaceOptions() {
    if (!visibleNamespaces.length) return null;
    const options = visibleNamespaces.map((ns) => {
      const value = NAMESPACE_ROW_PREFIX + ns.name;
      return (
        <SelectOption
          key={value}
          value={value}
          id={optionId(value)}
          isFocused={focusedValue === value}
          icon={<NamespaceIcon />}
        >
          <Flex
            spaceItems={{ default: "spaceItemsSm" }}
            alignItems={{ default: "alignItemsCenter" }}
          >
            <FlexItem>{ns.name}</FlexItem>
            <FlexItem>
              <Tooltip content={t("{{count}} Services", { count: ns.serviceCount })}>
                <Badge isRead>{ns.serviceCount}</Badge>
              </Tooltip>
            </FlexItem>
            {ns.name === browserNamespace && (
              <FlexItem>
                <Label isCompact variant="outline">
                  {t("Browser's namespace")}
                </Label>
              </FlexItem>
            )}
          </Flex>
        </SelectOption>
      );
    });
    // While searching, namespaces are one group among the Service results.
    return query ? (
      <SelectGroup label={t("Namespaces")}>
        <SelectList>{options}</SelectList>
      </SelectGroup>
    ) : (
      <SelectList>{options}</SelectList>
    );
  }

  function renderServiceOptions() {
    const groups = visibleServices.reduce<Record<string, ServiceSuggestion[]>>((acc, s) => {
      (acc[s.namespace] ||= []).push(s);
      return acc;
    }, {});
    return Object.entries(groups).map(([ns, items], i) => (
      <React.Fragment key={ns}>
        {(i > 0 || visibleNamespaces.length > 0) && <Divider />}
        {/* A single namespace is already named in the header. */}
        {isAllNamespaces ? (
          <SelectGroup label={ns}>
            <SelectList>{items.map(renderServiceOption)}</SelectList>
          </SelectGroup>
        ) : (
          <SelectList>{items.map(renderServiceOption)}</SelectList>
        )}
      </React.Fragment>
    ));
  }

  // Placeholder rows shaped like Service rows, so the menu doesn't jump when they load.
  function renderLoadingRows() {
    return (
      <div
        role="status"
        style={{
          display: "grid",
          gap: "var(--pf-t--global--spacer--md)",
          padding: "var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)"
        }}
      >
        {[45, 30, 38].map((width, i) => (
          <Flex
            key={i}
            spaceItems={{ default: "spaceItemsSm" }}
            alignItems={{ default: "alignItemsCenter" }}
          >
            <Skeleton shape="circle" width="24px" height="18px" />
            <div style={{ flex: 1, display: "grid", gap: 4 }}>
              <Skeleton width={`${width}%`} height="14px" />
              <Skeleton width={`${width + 15}%`} height="10px" />
            </div>
          </Flex>
        ))}
        <span className="pf-v6-screen-reader">{t("Loading Services")}</span>
      </div>
    );
  }

  // Listing failed: say why, and that typing a URL still works.
  function renderLoadError() {
    const status = getErrorStatus(services.loadError);
    const isForbidden = status === 403;
    const title = isForbidden
      ? isAllNamespaces
        ? t("You can't list Services in all namespaces")
        : t("You can't list Services in {{name}}", { name: viewNamespace })
      : t("Couldn't load Services");
    const detail = isForbidden
      ? t("You can still open a Service by typing its URL.")
      : `${getErrorMessage(services.loadError)}. ${t("Retrying automatically. You can still type a URL.")}`;
    return (
      // The menu adds its own spacer--sm below, matching the breadcrumb's spacing above.
      <div style={{ padding: "0 var(--pf-t--global--spacer--md) var(--pf-t--global--spacer--sm)" }}>
        <Alert isInline isPlain variant={isForbidden ? "warning" : "danger"} title={title}>
          {detail}
        </Alert>
      </div>
    );
  }

  function renderMenuBody() {
    const isEmpty =
      !showNamespaceList && visibleServices.length === 0 && visibleNamespaces.length === 0;
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
        {renderScopeHeader()}
        {services.loadError ? (
          renderLoadError()
        ) : !services.loaded ? (
          renderLoadingRows()
        ) : (
          <>
            {renderNamespaceOptions()}
            {renderServiceOptions()}
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
            {offerSearchAll && (
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
            {!showNamespaceList && matches.length > MAX_ROWS && (
              <SelectList>
                <SelectOption isDisabled value="__more__">
                  {t("Showing {{shown}} of {{total}}. Type to narrow the list.", {
                    shown: MAX_ROWS,
                    total: matches.length
                  })}
                </SelectOption>
              </SelectList>
            )}
          </>
        )}
      </>
    );
  }

  function navButton(kind: ControlActions, label: string, icon: React.ReactNode) {
    return (
      <Tooltip content={label}>
        <Button
          aria-label={label}
          isDisabled={isDisabled}
          onClick={() => runAction(kind)}
          icon={loadingAction === kind ? <Spinner size="sm" /> : icon}
          variant="plain"
        />
      </Tooltip>
    );
  }

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
          placeholder={
            browser && browser.status?.deploymentStatus !== "Ready"
              ? t("Waiting for the browser to be ready…")
              : t("Search Services or enter a URL")
          }
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
        {loadingAction === ControlActions.navigate && (
          <TextInputGroupUtilities>
            <Spinner size="sm" aria-label={t("Loading")} />
          </TextInputGroupUtilities>
        )}
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <>
      <Flex
        alignItems={{ default: "alignItemsCenter" }}
        flexWrap={{ default: "nowrap" }}
        spaceItems={{ default: "spaceItemsXs" }}
        style={{ padding: "var(--pf-t--global--spacer--xs) var(--pf-t--global--spacer--sm)" }}
      >
        <FlexItem>{navButton(ControlActions.backward, t("Back"), <ArrowLeftIcon />)}</FlexItem>
        <FlexItem>{navButton(ControlActions.forward, t("Forward"), <ArrowRightIcon />)}</FlexItem>
        <FlexItem>{navButton(ControlActions.reload, t("Reload"), <RedoIcon />)}</FlexItem>
        <FlexItem grow={{ default: "grow" }}>
          <Select
            id={MENU_ID}
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
              {renderMenuBody()}
            </div>
          </Select>
        </FlexItem>
      </Flex>
      <AlertGroup isToast isLiveRegion>
        {actionError && (
          <Alert
            variant="danger"
            title={t("Browser action failed")}
            timeout={8000}
            onTimeout={() => setActionError(undefined)}
            actionClose={<AlertActionCloseButton onClose={() => setActionError(undefined)} />}
          >
            {actionError.message}
            {actionError.hint && <p>{actionError.hint}</p>}
          </Alert>
        )}
      </AlertGroup>
    </>
  );
};

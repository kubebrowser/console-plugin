import { K8sBrowser } from "../types/browser";
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { browserGVK } from "../utils/gvk";

function useBrowsers(namespace: string) {
  // A null resource skips the watch when there's no namespace specified.
  const [options, optionsLoaded, loadError] = useK8sWatchResource<K8sBrowser[]>(
    namespace
      ? {
          isList: true,
          groupVersionKind: browserGVK,
          optional: true,
          namespace
        }
      : null
  );

  return {
    browsers: options ?? [],
    // A failed watch never reports loaded, so an error also ends the loading state.
    isLoading: !optionsLoaded && !loadError,
    loadError
  };
}

export default useBrowsers;

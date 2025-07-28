import { K8sBrowser } from '../types/browser';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { browserGVK } from '../utils/gvk';

function useBrowsers(namespace: string) {
  // error to be handled
  const [options, optionsLoaded] = useK8sWatchResource<K8sBrowser[]>({
    isList: true,
    groupVersionKind: browserGVK,
    optional: true,
    namespace: namespace || 'never', // meaning dont load when theres no namespace specified
  });

  return {
    browsers: options,
    isLoading: !optionsLoaded,
  };
}

export default useBrowsers;

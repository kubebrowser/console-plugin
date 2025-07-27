import { K8sBrowser } from 'src/types/browser';
import { PodModel } from '../utils/models';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

function useBrowsers(namespace: string) {
  const [options, optionsLoaded] = useK8sWatchResource<K8sBrowser[]>({
    isList: true,
    kind: PodModel.kind,
    optional: true,
    namespace: namespace || 'never', // meaning dont load when theres no namespace specified
  });

  return {
    browsers: options,
    isLoading: !optionsLoaded,
  };
}

export default useBrowsers;

import { BrowserModel } from '../utils/models';
import { useK8sWatchResource, K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

function useBrowsers(namespace: string) {
  const [options, optionsLoaded] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    kind: BrowserModel.kind,
    optional: true,
    namespace,
  });

  return {
    browsers: options.filter((opt) => opt).map((opt) => opt.metadata.name),
    isLoading: !optionsLoaded,
  };
}

export default useBrowsers;

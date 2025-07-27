import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';

export const deploymentGVK: K8sGroupVersionKind = {
  group: 'apps',
  version: 'v1',
  kind: 'Deployment',
};
export const namespaceGVK: K8sGroupVersionKind = {
  group: 'core',
  version: 'v1',
  kind: 'Namespace',
};

import {
  K8sGroupVersionKind,
  K8sResourceCommon,
  ObjectMetadata,
} from '@openshift-console/dynamic-plugin-sdk';

export const deploymentGVK: K8sGroupVersionKind = {
  group: 'apps',
  version: 'v1',
  kind: 'Deployment',
};
export const browserGVK: K8sGroupVersionKind = {
  group: 'core',
  version: 'v1alpha1',
  kind: 'Browser',
};
export const namespaceGVK: K8sGroupVersionKind = {
  group: 'core',
  version: 'v1',
  kind: 'Namespace',
};

export function getK8sResourceCommon(
  metadata: ObjectMetadata,
  gvk: K8sGroupVersionKind,
): K8sResourceCommon {
  return {
    kind: gvk.kind,
    apiVersion: [gvk.group, gvk.version].join('/'),
    metadata: metadata,
  };
}

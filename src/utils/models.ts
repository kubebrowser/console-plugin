import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const NamespaceModel: K8sModel = {
  apiVersion: 'v1',
  label: 'Namespace',
  // t('public~Namespace')
  labelKey: 'public~Namespace',
  plural: 'namespaces',
  abbr: 'NS',
  kind: 'Namespace',
  id: 'namespace',
  labelPlural: 'Namespaces',
  // t('public~Namespaces')
  labelPluralKey: 'public~Namespaces',
};

export const ProjectModel: K8sModel = {
  apiVersion: 'v1',
  apiGroup: 'project.openshift.io',
  label: 'Project',
  // t('public~Project')
  labelKey: 'public~Project',
  plural: 'projects',
  abbr: 'PR',
  kind: 'Project',
  id: 'project',
  labelPlural: 'Projects',
  // t('public~Projects')
  labelPluralKey: 'public~Projects',
};

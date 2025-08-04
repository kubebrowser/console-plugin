import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";

export const NamespaceModel: K8sModel = {
  apiVersion: "v1",
  label: "Namespace",
  // t('public~Namespace')
  labelKey: "public~Namespace",
  plural: "namespaces",
  abbr: "NS",
  kind: "Namespace",
  id: "namespace",
  labelPlural: "Namespaces",
  // t('public~Namespaces')
  labelPluralKey: "public~Namespaces"
};

export const ProjectModel: K8sModel = {
  apiVersion: "v1",
  apiGroup: "project.openshift.io",
  label: "Project",
  // t('public~Project')
  labelKey: "public~Project",
  plural: "projects",
  abbr: "PR",
  kind: "Project",
  id: "project",
  labelPlural: "Projects",
  // t('public~Projects')
  labelPluralKey: "public~Projects"
};

export const BrowserModel: K8sModel = {
  apiVersion: "v1alpha1",
  apiGroup: "core.kubebrowser.io",
  label: "Browser",
  // t('console-plugin-name~Browser')
  labelKey: "console-plugin-name~Browser",
  plural: "browsers",
  abbr: "BR",
  kind: "Browser",
  id: "browser",
  labelPlural: "Browsers",
  // t('console-plugin-name~Projects')
  labelPluralKey: "console-plugin-name~Browsers",
  crd: true
};

export const PodModel: K8sModel = {
  apiVersion: "v1",
  label: "Pod",
  // t('public~Pod')
  labelKey: "public~Pod",
  plural: "pods",
  abbr: "P",
  namespaced: true,
  kind: "Pod",
  id: "pod",
  labelPlural: "Pods",
  // t('public~Pods')
  labelPluralKey: "public~Pods"
};

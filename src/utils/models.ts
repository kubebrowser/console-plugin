import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";

export const NamespaceModel: K8sModel = {
  apiVersion: "v1",
  label: "Namespace",
  // t('plugin__kubebrowser-plugin~Namespace')
  labelKey: "plugin__kubebrowser-plugin~Namespace",
  plural: "namespaces",
  abbr: "NS",
  kind: "Namespace",
  id: "namespace",
  labelPlural: "Namespaces",
  // t('plugin__kubebrowser-plugin~Namespaces')
  labelPluralKey: "plugin__kubebrowser-plugin~Namespaces"
};

export const ProjectModel: K8sModel = {
  apiVersion: "v1",
  apiGroup: "project.openshift.io",
  label: "Project",
  // t('plugin__kubebrowser-plugin~Project')
  labelKey: "plugin__kubebrowser-plugin~Project",
  plural: "projects",
  abbr: "PR",
  kind: "Project",
  id: "project",
  labelPlural: "Projects",
  // t('plugin__kubebrowser-plugin~Projects')
  labelPluralKey: "plugin__kubebrowser-plugin~Projects"
};

export const BrowserModel: K8sModel = {
  apiVersion: "v1alpha1",
  apiGroup: "core.kubebrowser.io",
  label: "Browser",
  // t('plugin__kubebrowser-plugin~Browser')
  labelKey: "plugin__kubebrowser-plugin~Browser",
  plural: "browsers",
  abbr: "BR",
  kind: "Browser",
  id: "browser",
  labelPlural: "Browsers",
  // t('plugin__kubebrowser-plugin~Projects')
  labelPluralKey: "plugin__kubebrowser-plugin~Browsers",
  crd: true
};

export const PodModel: K8sModel = {
  apiVersion: "v1",
  label: "Pod",
  // t('plugin__kubebrowser-plugin~Pod')
  labelKey: "plugin__kubebrowser-plugin~Pod",
  plural: "pods",
  abbr: "P",
  namespaced: true,
  kind: "Pod",
  id: "pod",
  labelPlural: "Pods",
  // t('plugin__kubebrowser-plugin~Pods')
  labelPluralKey: "plugin__kubebrowser-plugin~Pods"
};

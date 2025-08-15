import { NamespaceModel, ProjectModel } from "../utils/models";
import { useK8sWatchResource, K8sResourceKind } from "@openshift-console/dynamic-plugin-sdk";
import { usePluginTranslation } from "./usePluginTranslation";

function useNamespaces() {
  const { t } = usePluginTranslation();
  const isProjects = t("Project") || t("Namespace");

  const [options, optionsLoaded] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    kind: isProjects ? ProjectModel.kind : NamespaceModel.kind,
    optional: true
  });

  return {
    namespaces: options.filter((opt) => opt).map((opt) => opt.metadata!.name),
    isLoading: !optionsLoaded
  };
}

export default useNamespaces;

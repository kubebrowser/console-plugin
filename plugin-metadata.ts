import { ConsolePluginBuildMetadata } from "@openshift-console/dynamic-plugin-sdk-webpack";

const metadata: ConsolePluginBuildMetadata = {
  name: "kubebrowser-plugin",
  version: "0.0.1",
  displayName: "OpenShift Console Plugin Template",
  description:
    "Template project for OpenShift Console plugins. Edit package.json to change this message and the plugin name.",
  exposedModules: {
    Browser: "./pages/Browser/Browser"
  },
  dependencies: {
    "@console/pluginAPI": "*"
  }
};

export default metadata;

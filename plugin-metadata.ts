import { ConsolePluginBuildMetadata } from "@openshift-console/dynamic-plugin-sdk-webpack";

const metadata: ConsolePluginBuildMetadata = {
  name: "kubebrowser-plugin",
  version: "0.0.1",
  displayName: "Kubebrowser Plugin",
  description: "This plugin integrates web browsing into the web console UI",
  exposedModules: {
    Browser: "./pages/Browser/Browser"
  },
  dependencies: {
    "@console/pluginAPI": "*"
  }
};

export default metadata;

import { ObjectMetadata } from "@openshift-console/dynamic-plugin-sdk";

export type K8sBrowser = {
  metadata: ObjectMetadata;
  spec: {
    started: boolean;
  };
  status: {
    deploymentStatus?: "Ready" | "Progressing" | "Stopped";
    [key: string]: any;
  };
};

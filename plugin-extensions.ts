import { EncodedExtension } from "@openshift-console/dynamic-plugin-sdk-webpack";

const extensions: EncodedExtension[] = [
  {
    type: "console.page/route",
    properties: {
      exact: true,
      path: ["/browsers"],
      component: { $codeRef: "Browser" }
    }
  },
  {
    type: "console.navigation/href",
    properties: {
      id: "browsers-admin",
      name: "%plugin__kubebrowser_plugin~Web Browsers%",
      href: "/browsers",
      perspective: "admin",
      section: "networking",
      insertAfter: ["udns", "networkattachmentdefinitions", "networkPolicies"]
    }
  },
  {
    type: "console.navigation/href",
    properties: {
      id: "browsers-dev",
      name: "%plugin__kubebrowser_plugin~Web Browsers%",
      href: "/browsers",
      perspective: "dev",
      insertAfter: "topology",
      section: "top"
    }
  }
];

export default extensions;

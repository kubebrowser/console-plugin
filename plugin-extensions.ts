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
      id: "browsers",
      name: "Browsers",
      href: "/browsers",
      perspective: "admin",
      section: "networking"
    }
  }
];

export default extensions;

import * as React from "react";
import { Button, Flex } from "@patternfly/react-core";
import { FC } from "react";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { k8sPatch } from "@openshift-console/dynamic-plugin-sdk";
import { BrowserModel } from "../../utils/models";
import { useTranslation } from "react-i18next";

export const BrowserActions: FC<{
  browserName?: string;
  browserNamespace?: string;
  specStarted?: boolean;
  statusDeploymentStatus?: string;
  toggleBrowserDrawer?: () => void;
}> = ({ browserName, specStarted, toggleBrowserDrawer, browserNamespace }) => {
  const [btnLoading, setBtnLoading] = React.useState<"stop" | "start" | undefined>(undefined);

  const { t } = useTranslation();

  async function patchStarted(value: boolean) {
    if (btnLoading) return;
    setBtnLoading(!value ? "stop" : "start");

    try {
      await k8sPatch({
        data: [
          {
            op: "replace",
            path: "/spec/started",
            value: value
          }
        ],
        model: BrowserModel,
        resource: {
          apiVersion: BrowserModel.apiGroup + "/" + BrowserModel.apiVersion,
          kind: BrowserModel.kind,
          metadata: { name: browserName, namespace: browserNamespace }
        }
      });
    } catch (err) {
      console.log("Failed to edit browser ", err);
    }

    setBtnLoading(undefined);
  }

  return (
    <Flex columnGap={{ default: "columnGapSm" }} alignItems={{ default: "alignItemsCenter" }}>
      <Button
        variant="secondary"
        ouiaId="Primary"
        isLoading={btnLoading === "stop"}
        onClick={() => patchStarted(false)}
        isDisabled={!browserName || specStarted !== true || !!btnLoading}
      >
        {t("Stop")}
      </Button>
      <Button
        variant="secondary"
        ouiaId="Primary"
        onClick={() => patchStarted(true)}
        isLoading={btnLoading === "start"}
        isDisabled={!browserName || specStarted !== false || !!btnLoading}
      >
        {t("Start")}
      </Button>
      <Button
        icon={<InfoCircleIcon />}
        variant="secondary"
        isDisabled={!browserName}
        onClick={toggleBrowserDrawer}
      />
    </Flex>
  );
};

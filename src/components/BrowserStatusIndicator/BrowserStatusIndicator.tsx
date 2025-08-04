import { Icon, Label } from "@patternfly/react-core";
import { SyncIcon, InProgressIcon, OffIcon } from "@patternfly/react-icons";
import * as React from "react";
import { FC } from "react";

export const BrowserStatusIndicator: FC<{ status?: string }> = ({ status }) => {
  if (!status) return null;
  return (
    <Label
      isCompact
      color={status === "Ready" ? "blue" : status === "Progressing" ? "orange" : "grey"}
    >
      <Icon size="sm">
        {status === "Ready" ? (
          <SyncIcon style={{ color: "#0075DE" }} />
        ) : status === "Progressing" ? (
          <InProgressIcon style={{ color: "#e27100ff" }} />
        ) : (
          <OffIcon style={{ color: "#A9A9A9" }} />
        )}
      </Icon>
    </Label>
  );
};

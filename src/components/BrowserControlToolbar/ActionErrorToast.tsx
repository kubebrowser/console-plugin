import * as React from "react";
import { Alert, AlertActionCloseButton, AlertGroup } from "@patternfly/react-core";
import { ActionError } from "../../hooks/useBrowserAction";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";

export const ActionErrorToast: React.FC<{ error?: ActionError; onClose: () => void }> = ({
  error,
  onClose
}) => {
  const { t } = usePluginTranslation();
  return (
    <AlertGroup isToast isLiveRegion>
      {error && (
        <Alert
          variant="danger"
          title={t("Browser action failed")}
          timeout={8000}
          onTimeout={onClose}
          actionClose={<AlertActionCloseButton onClose={onClose} />}
        >
          {error.message}
          {error.hint && <p>{error.hint}</p>}
        </Alert>
      )}
    </AlertGroup>
  );
};

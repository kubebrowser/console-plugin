import * as React from "react";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  FormAlert,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Spinner,
  TextInput
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { BrowserModel } from "../../utils/models";
import { k8sCreate, useActiveNamespace } from "@openshift-console/dynamic-plugin-sdk";

export const CreateBrowserModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { t } = useTranslation();
  const [name, setName] = React.useState<string>("");
  const [namespace] = useActiveNamespace();
  const [started, setStarted] = React.useState<boolean>(false);
  const [inProgress, setInProgress] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const thenPromise = (res: unknown) => {
    setInProgress(false);
    setErrorMessage("");
    return res;
  };

  const catchError = (error: Error) => {
    const err = error.message || t("An error occurred. Please try again.");
    setInProgress(false);
    setErrorMessage(err);
    return Promise.reject(err);
  };

  const handlePromise = (promise: Promise<any>) => {
    setInProgress(true);

    return promise.then(
      (res) => thenPromise(res),
      (error) => catchError(error)
    );
  };

  const createBrowser = React.useCallback(async () => {
    const data = {
      kind: BrowserModel.kind,
      apiVersion: BrowserModel.apiGroup + "/" + BrowserModel.apiVersion,
      metadata: {
        name,
        namespace
      },
      spec: {
        started
      }
    };
    return k8sCreate({ model: BrowserModel, data });
  }, [name, started]);

  const create = () => {
    handlePromise(createBrowser())
      .then(closeModal)
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.error(`Failed to create Browser:`, err);
      });
  };

  return (
    <Modal variant={ModalVariant.small} isOpen onClose={closeModal}>
      <ModalHeader
        title={t("Create Browser")}
        description={t("Create a browser deployment in your selected namespace.")}
      />
      <ModalBody>
        <Form>
          <FormGroup label={t("Name")} isRequired fieldId="input-name">
            <TextInput
              id="input-name"
              data-test="input-name"
              name="name"
              type="text"
              onChange={(_e, v) => setName(v)}
              value={name || ""}
              autoFocus
              required
            />
          </FormGroup>
          <FormGroup fieldId="input-display-name">
            <Checkbox
              id="started"
              checked={started}
              onClick={() => setStarted(!started)}
              label={t("Start browser immediately")}
              // onChange={(_e, checked) => setStarted(checked)}
            />
          </FormGroup>

          {errorMessage && (
            <FormAlert>
              <Alert
                isInline
                variant="danger"
                title={t("An error occurred.")}
                data-test="alert-error"
              >
                {errorMessage}
              </Alert>
            </FormAlert>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        {inProgress
          ? [<Spinner key="foo" />]
          : [
              <Button key="create" variant="primary" onClick={create}>
                {t("Create")}
              </Button>,
              <Button key="cancel" variant="link" onClick={closeModal}>
                {t("Cancel")}
              </Button>
            ]}
      </ModalFooter>
    </Modal>
  );
};

import {
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode
} from "@patternfly/react-core";
import * as React from "react";
import { FC } from "react";
import { K8sBrowser } from "../../types/browser";
import { usePluginTranslation } from "../../hooks/usePluginTranslation";

export const BrowserYaml: FC<{ browser: K8sBrowser }> = ({ browser }) => {
  const [copied, setCopied] = React.useState(false);
  const { t } = usePluginTranslation();

  const code = React.useMemo(() => {
    return JSON.stringify(browser, undefined, 2);
  }, [browser]);

  const copyYaml = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  return (
    <CodeBlock
      style={{ maxHeight: 400, overflowY: "scroll", marginTop: 10 }}
      actions={
        <CodeBlockAction>
          <ClipboardCopyButton
            id="copy-browser-btn"
            textId="code-content"
            aria-label="Copy browser yaml"
            onClick={copyYaml}
            exitDelay={copied ? 1500 : 600}
            maxWidth="110px"
            variant="plain"
            onTooltipHidden={() => setCopied(false)}
          >
            {copied ? t("Successfully copied to clipboard") : t("Copy to clipboard")}
          </ClipboardCopyButton>
        </CodeBlockAction>
      }
    >
      <CodeBlockCode>{code}</CodeBlockCode>
    </CodeBlock>
  );
};

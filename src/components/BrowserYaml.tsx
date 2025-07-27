import {
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
} from '@patternfly/react-core';
import * as React from 'react';
import { FC } from 'react';
import { K8sBrowser } from 'src/types/browser';

export const BrowserYaml: FC<{ browser: K8sBrowser }> = ({ browser }) => {
  const [copied, setCopied] = React.useState(false);
  const code = React.useMemo(() => {
    return JSON.stringify(browser, undefined, 2);
  }, [browser]);

  const copyYaml = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  return (
    <CodeBlock
      style={{ maxHeight: 450, overflowY: 'scroll', marginTop: 10 }}
      actions={
        <CodeBlockAction>
          <ClipboardCopyButton
            id="basic-copy-button"
            textId="code-content"
            aria-label="Copy to clipboard basic example code block"
            onClick={copyYaml}
            exitDelay={copied ? 1500 : 600}
            maxWidth="110px"
            variant="plain"
            onTooltipHidden={() => setCopied(false)}
          >
            {copied ? 'Successfully copied to clipboard!' : 'Copy to clipboard'}
          </ClipboardCopyButton>
        </CodeBlockAction>
      }
    >
      <CodeBlockCode>{code}</CodeBlockCode>
    </CodeBlock>
  );
};

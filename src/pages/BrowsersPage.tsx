import * as React from 'react';
import { Fragment, useState } from 'react';
import { PageSection } from '@patternfly/react-core';
import { BrowserToolbar } from '../components/BrowserToolbar';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';

export default function BrowsersPage() {
  const navigate = useNavigate();
  const params = useParams<{ ns: string | undefined }>();
  const namespace = params.ns;

  const [browser, setBrowser] = useState<string | undefined>(undefined);

  function onNamespaceChange(newNamespace: string) {
    setBrowser(undefined);
    navigate(`/browsers/ns/${newNamespace}`, { replace: true });
  }

  function onBrowserChange(newBrowser: string) {
    setBrowser(newBrowser);
  }

  return (
    <Fragment>
      <PageSection>
        <BrowserToolbar
          namespace={namespace}
          onNamespaceChange={onNamespaceChange}
          browser={browser}
          onBrowserChange={onBrowserChange}
        />
      </PageSection>
      <PageSection>
        <p>browsers</p>
      </PageSection>
    </Fragment>
  );
}

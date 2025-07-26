import * as React from 'react';
import { Fragment } from 'react';
import { PageSection } from '@patternfly/react-core';
import { SelectorToolbar } from '../components/SelectorToolbar';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';

export default function BrowsersPage() {
  const navigate = useNavigate();
  const params = useParams<{ ns: string | undefined }>();
  const namespace = params.ns;

  function onNamespaceChange(newNamespace: string) {
    navigate(`/browsers/ns/${newNamespace}`, { replace: true });
  }

  return (
    <Fragment>
      <PageSection>
        <SelectorToolbar namespace={namespace} onNamespaceChange={onNamespaceChange} />
      </PageSection>
      <PageSection>
        <p>browsers</p>
      </PageSection>
    </Fragment>
  );
}

import * as React from 'react';
import { Fragment, useState } from 'react';
import { Drawer, DrawerContent, DrawerContentBody, PageSection } from '@patternfly/react-core';
import { SelectorToolbar } from '../components/SelectorToolbar';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';
import { K8sBrowser } from '../types/browser';
import { NoBrowserState } from '../components/NoBrowserState';
import { BrowserContent } from '../components/BrowserContent';
import { BrowserDetailsPanel } from '../components/BrowserDetailsPanel';

export default function BrowsersPage() {
  const navigate = useNavigate();
  const params = useParams<{ ns: string | undefined }>();
  const namespace = params.ns;

  const [browser, setBrowser] = useState<K8sBrowser | undefined>(undefined);
  const [detailsDrawerExpanded, setDetailsDrawerExpanded] = useState(false);

  function onNamespaceChange(newNamespace: string) {
    setBrowser(undefined);
    navigate(`/browsers/ns/${newNamespace}`, { replace: true });
  }

  function onBrowserChange(newBrowser: K8sBrowser) {
    setBrowser(newBrowser);
  }

  function onBrowserDelete() {}

  function toggleBrowserDrawer() {
    setDetailsDrawerExpanded(!detailsDrawerExpanded);
  }
  function onDetailsDrawerClose() {
    setDetailsDrawerExpanded(false);
  }

  return (
    <Fragment>
      <PageSection style={{ paddingBottom: 0 }}>
        <SelectorToolbar
          namespace={namespace}
          onNamespaceChange={onNamespaceChange}
          browser={browser}
          onBrowserChange={onBrowserChange}
          toggleBrowserDrawer={toggleBrowserDrawer}
        />
      </PageSection>
      <hr style={{ borderColor: '#0000002d' }} />
      {!browser ? (
        <PageSection isFilled style={{ paddingTop: 0 }} variant="secondary">
          <NoBrowserState />
        </PageSection>
      ) : (
        <PageSection isFilled style={{ padding: 0 }} variant="secondary" hasBodyWrapper={false}>
          <Drawer isExpanded={detailsDrawerExpanded}>
            <DrawerContent
              panelContent={
                <BrowserDetailsPanel
                  browser={browser}
                  onClose={onDetailsDrawerClose}
                  onBrowserDelete={onBrowserDelete}
                />
              }
            >
              <DrawerContentBody>
                <BrowserContent browser={browser} />
              </DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </PageSection>
      )}
    </Fragment>
  );
}

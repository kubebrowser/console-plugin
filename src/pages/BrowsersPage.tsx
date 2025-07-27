import * as React from 'react';
import { Fragment, useState } from 'react';
import { Drawer, DrawerContent, DrawerContentBody, PageSection } from '@patternfly/react-core';
import { BrowserToolbar } from '../components/BrowserToolbar';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';
import { K8sBrowser } from '../types/browser';
import { NoBrowserState } from '../components/NoBrowserState';
import { BrowserContent } from '../components/BrowserContent';
import { BrowserDetailsPanel } from '../components/BrowserDetailsPanel';
import { BrowserControlToolbar } from '../components/BrowserControlToolbar';

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
      <PageSection style={{ padding: 0 }}>
        <BrowserToolbar
          namespace={namespace}
          onNamespaceChange={onNamespaceChange}
          browser={browser}
          onBrowserChange={onBrowserChange}
          toggleBrowserDrawer={toggleBrowserDrawer}
        />
      </PageSection>
      {!browser ? (
        <PageSection isFilled style={{ paddingTop: 0 }} variant="secondary" hasBodyWrapper={false}>
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
                <div
                  style={{
                    padding: 0,
                    position: 'absolute',
                    // bottom: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    // width: 'max-content',
                    // marginLeft: 'auto',
                    // marginRight: 'auto',
                  }}
                >
                  <BrowserControlToolbar browser={browser} />
                </div>
              </DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </PageSection>
      )}
    </Fragment>
  );
}

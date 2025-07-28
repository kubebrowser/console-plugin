import * as React from 'react';
import { Fragment, useState } from 'react';
import { Drawer, DrawerContent, DrawerContentBody, PageSection } from '@patternfly/react-core';
import { BrowserToolbar } from '../components/BrowserToolbar';
import { K8sBrowser } from '../types/browser';
import { NoBrowserState } from '../components/NoBrowserState';
import { BrowserContent } from '../components/BrowserContent';
import { BrowserPanel } from '../components/BrowserPanel';
import { BrowserControlToolbar } from '../components/BrowserControlToolbar';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';

export default function BrowsersPage() {
  const [currentNamespace, setCurrentNamespace] = useActiveNamespace();

  const [browser, setBrowser] = useState<K8sBrowser | undefined>(undefined);
  const [detailsDrawerExpanded, setDetailsDrawerExpanded] = useState(false);

  function onNamespaceChange(newNamespace: string) {
    setBrowser(undefined);
    setDetailsDrawerExpanded(false);
    setCurrentNamespace(newNamespace);
  }

  function onBrowserChange(newBrowser: K8sBrowser) {
    // if namespace is different set?
    setBrowser(newBrowser);
  }

  function onBrowserDelete() {}

  function toggleBrowserDrawer() {
    setDetailsDrawerExpanded(!detailsDrawerExpanded);
  }
  function onDetailsDrawerClose() {
    setDetailsDrawerExpanded(false);
  }

  console.log('rerendered');

  return (
    <Fragment>
      <PageSection style={{ padding: 0 }}>
        <BrowserToolbar
          namespace={currentNamespace}
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
                <BrowserPanel
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

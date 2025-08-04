import * as React from "react";
import { Fragment, useState } from "react";
import { Drawer, DrawerContent, DrawerContentBody, PageSection } from "@patternfly/react-core";
import { useActiveNamespace } from "@openshift-console/dynamic-plugin-sdk";
import { BrowserContent } from "../../components/BrowserContent/BrowserContent";
import { BrowserControlToolbar } from "../../components/BrowserControlToolbar/BrowserControlToolbar";
import { BrowserPanel } from "../../components/BrowserPanel/BrowserPanel";
import { BrowserToolbar } from "../../components/BrowserToolbar/BrowserToolbar";
import { K8sBrowser } from "../../types/browser";

export default function Browser() {
  const [currentNamespace, setCurrentNamespace] = useActiveNamespace();

  const [browser, setBrowser] = useState<K8sBrowser | undefined>(undefined);
  const [detailsDrawerExpanded, setDetailsDrawerExpanded] = useState(false);

  function onNamespaceChange(newNamespace: string) {
    setBrowser(undefined);
    setDetailsDrawerExpanded(false);
    setCurrentNamespace(newNamespace);
  }

  function onBrowserChange(newBrowser: K8sBrowser | undefined) {
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

      <PageSection isFilled style={{ padding: 0 }} variant="secondary" hasBodyWrapper={false}>
        <Drawer isExpanded={!!browser && detailsDrawerExpanded}>
          <DrawerContent
            panelContent={
              !!browser ? (
                <BrowserPanel
                  browser={browser}
                  onClose={onDetailsDrawerClose}
                  onBrowserDelete={onBrowserDelete}
                />
              ) : (
                <></>
              )
            }
          >
            <DrawerContentBody>
              <BrowserContent browser={browser} />
              <div
                style={{
                  padding: 0,
                  display: !browser ? "none" : undefined,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0
                  // bottom: 0,
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
    </Fragment>
  );
}

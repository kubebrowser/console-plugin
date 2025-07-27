import * as React from 'react';
import { Divider } from '@patternfly/react-core';
import { K8sBrowser } from '../types/browser';
import { SelectorToolbar } from './SelectorToolbar';

export const BrowserToolbar: React.FC<{
  namespace: string;
  onNamespaceChange: (newNamespace: string) => void;
  browser: K8sBrowser;
  onBrowserChange: (newBrowser: K8sBrowser) => void;
  toggleBrowserDrawer: () => void;
}> = ({ namespace, onNamespaceChange, browser, onBrowserChange, toggleBrowserDrawer }) => {
  return (
    <React.Fragment>
      <SelectorToolbar
        browser={browser}
        onBrowserChange={onBrowserChange}
        namespace={namespace}
        onNamespaceChange={onNamespaceChange}
        toggleBrowserDrawer={toggleBrowserDrawer}
      />
      <Divider />
      {/* {browser && (
        <React.Fragment>
          <BrowserControlToolbar browser={browser} />
          <Divider />
        </React.Fragment>
      )} */}
    </React.Fragment>
  );
};

import * as React from 'react';
import { FC } from 'react';
import { K8sBrowser } from 'src/types/browser';

export const BrowserBrowser: FC<{ browser: K8sBrowser }> = ({ browser }) => {
  return (
    <div>
      <p>browser browser</p>
    </div>
  );
};

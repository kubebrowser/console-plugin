import * as React from 'react';
import { K8sBrowser } from 'src/types/browser';

export const BrowserContent: React.FC<{ browser: K8sBrowser }> = ({ browser }) => {
  return (
    <div>
      <p>straight up browser</p>
    </div>
  );
};

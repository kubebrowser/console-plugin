import * as React from 'react';
import { FC } from 'react';
import { K8sBrowser } from 'src/types/browser';

export const BrowserVnc: FC<{ browser: K8sBrowser }> = ({ browser }) => {
  return (
    <div>
      <p>browser vnc</p>
    </div>
  );
};

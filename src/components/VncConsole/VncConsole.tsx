import React, { FC, HTMLProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
// import { useTranslation } from "react-i18next";
import { ConsoleState, INSECURE, isConnectionEncrypted, SECURE, WS, WSS } from "./utils";
// @ts-ignore
import RFBCreate from "@novnc/novnc/lib/rfb";
// @ts-ignore
import { initLogging } from "@novnc/novnc/lib/util/logging";
import "./vnc-console.css";
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Button,
  Spinner
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

const { connected, disconnected, connecting } = ConsoleState;

export const VncConsole: FC<
  HTMLProps<HTMLDivElement> & {
    path: string;
    scaleViewport?: boolean;
    viewOnly?: boolean;
  }
> = ({ scaleViewport = true, viewOnly = false, path }) => {
  const [rfb, setRfb] = useState<RFBCreate>();
  const [status, setStatus] = useState<ConsoleState>(disconnected);

  const { t } = useTranslation();

  const staticRenderLocationRef = useRef(null);
  const StaticRenderLocation = useMemo(
    () => (
      <div
        className={cn("vnc-container", { hide: status !== connected })}
        ref={staticRenderLocationRef}
      />
    ),
    [staticRenderLocationRef, status]
  );

  const connect = useCallback(() => {
    setStatus(connecting);
    setRfb(() => {
      const isEncrypted = isConnectionEncrypted();
      const port = window.location.port || (isEncrypted ? SECURE : INSECURE);
      const url = `${isEncrypted ? WSS : WS}://${window.location.hostname}:${port}${path}`;
      const rfbInstnce = new RFBCreate(staticRenderLocationRef.current, url);
      rfbInstnce?.addEventListener("connect", () => setStatus(connected));
      rfbInstnce?.addEventListener("disconnect", () => {
        setStatus(disconnected);
      });
      rfbInstnce?.addEventListener("securityfailure", () => {
        setStatus(disconnected);
      });

      rfbInstnce.viewOnly = viewOnly;
      rfbInstnce.scaleViewport = scaleViewport;

      return rfbInstnce;
    });
  }, [path, viewOnly, scaleViewport]);

  useEffect(() => {
    if (!rfb && status === disconnected) {
      try {
        initLogging("debug");
        connect();
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      if (rfb && status === connected) {
        rfb?.disconnect();
      }
    };
  }, [connect, rfb, status]);

  return (
    <>
      {/* for whatever reason including this causes flickering */}
      {status === connecting && (
        <EmptyState icon={Spinner}>
          <EmptyStateBody>{t("Loading")}...</EmptyStateBody>
        </EmptyState>
      )}

      {status === disconnected && (
        <EmptyState>
          <EmptyStateBody>{t("Click Connect to open the VNC console.")}</EmptyStateBody>
          <EmptyStateFooter>
            <Button onClick={connect} variant="primary">
              {t("Connect")}
            </Button>
          </EmptyStateFooter>
        </EmptyState>
      )}
      {StaticRenderLocation}
    </>
  );
};

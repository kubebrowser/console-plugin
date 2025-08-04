export const isConnectionEncrypted = () => window.location.protocol === "https:";

export enum ConsoleState {
  "connected" = "connected",
  "connecting" = "connecting",
  "destroyed" = "destroyed",
  "disconnected" = "disconnected",
  "disconnecting" = "disconnecting",
  "init" = "init",
  "loading" = "loading",
  "open" = "open"
}

export const WS = "ws";
export const WSS = "wss";

export const SECURE = "443";
export const INSECURE = "80";

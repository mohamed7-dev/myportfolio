import { sharedConfig } from "../config/shared-config";

export const apiUrl = (path: string) => {
  return `${sharedConfig.server.host}/api/${path}`;
};

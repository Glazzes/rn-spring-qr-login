export type Code = {
  mobileId: string;
  webId: string;
  requestedBy: string;
  deviceInfo: {
    ip: string;
    os: string;
    browser: string;
  };
};

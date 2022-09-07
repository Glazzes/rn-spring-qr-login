export type User = {
  id: string;
  username: string;
  profilePicture: string;
};

export type QrCode = {
  issuedFor: string;
  mobileId: string;
  deviceId: string;
  deviceName: string;
  location: string;
  ipAddress: string;
  os: string;
};

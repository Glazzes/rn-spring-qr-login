export type User = {
  id: string;
  username: string;
  profilePicture: string;
};

export type Information = {
  image: any;
  alt: string;
  title: string;
  info: string;
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

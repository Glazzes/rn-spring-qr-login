export type StackScreens = {
  Login: undefined;
  Home: undefined;
  NotFound: undefined;
};

export type User = {
  id: string;
  username: string;
  profilePicture: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
}

export type DisplayUserEventDTO = {
  user: User;
  mobileId: string;
}

export type QrCode = {
  issuedFor: string;
  mobileId: string;
  deviceId: string;
  deviceName: string;
  location: string;
  ipAddress: string;
  os: string;
};

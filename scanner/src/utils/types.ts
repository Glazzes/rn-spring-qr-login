export type Vector<T> = {
  x: T;
  y: T;
};

export type User = {
  id: string;
  username: string;
  profilePicture: string;
};

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type Notification = {
  type: NotificationType;
  title: string;
  message: string;
};

export type Information = {
  image: any;
  alt: string;
  title: string;
  info: string;
};

export type UsernamePasswordLogin = {
  username: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
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

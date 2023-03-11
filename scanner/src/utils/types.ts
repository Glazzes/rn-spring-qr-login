export type Vector<T> = {
  x: T;
  y: T;
};

export type StackScreens = {
  Login: {
    createdAccount: boolean;
  };

  CreateAccount: undefined;

  CropEditor: {
    uri: string;
    width: number;
    height: number;
  };

  Home: undefined;

  Warning: undefined;

  DeviceInformation: {
    id: string;
    qrCode: QrCode;
    location: string;
    device: string;
    ipAddress: string;
  };

  Scanner: undefined;

  ScanResult: {information: Information};
};

export type AccountCreationFields =
  | 'username'
  | 'password'
  | 'email'
  | 'confirmation';

export type User = {
  id: string;
  username: string;
  email: string;
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

export type EmailPasswordLogin = {
  email: string;
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

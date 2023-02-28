import {Information, QrCode} from '../utils/types';

export type StackScreens = {
  Modal: undefined;

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

import {Information, QrCode} from '../utils/types';

export type StackScreens = {
  Login: undefined;

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
  Success: {information: Information};
};

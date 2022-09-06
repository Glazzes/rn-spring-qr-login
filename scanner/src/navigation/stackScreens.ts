import {Information} from '../types/information';

export type StackScreens = {
  Login: undefined;

  Home: undefined;
  Warning: undefined;
  DeviceInformation: {location: string; device: string; ipAddress: string};
  Scanner: undefined;
  Success: {information: Information};
};

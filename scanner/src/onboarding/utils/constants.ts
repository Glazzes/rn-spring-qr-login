import {Dimensions} from 'react-native';
import {ScanStatus} from '../../scanner/utils/types';

const {width} = Dimensions.get('window');
export const IMAGE_SIZE = width / 2;

export const ACCOUNT_CREATED_INFO: ScanStatus = {
  title: 'Account created!',
  message: 'Your account has been created successfully',
  type: 'success',
};

export const INVALID_CREDENTIALS: ScanStatus = {
  title: 'Invalid credentials',
  message: 'Your email or password are incorrect',
  type: 'error',
};

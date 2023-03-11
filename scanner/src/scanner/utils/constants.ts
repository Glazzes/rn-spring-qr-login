import {ScanStatus} from './types';

export const PROCESSING_CODE_INFO: ScanStatus = {
  title: 'Processing code',
  message: "We're processing you code, wait a second while we log you in",
  type: 'info',
};

export const INVALID_CODE_ERROR: ScanStatus = {
  title: 'Invalid code',
  message: "The QR code you just scanned it's not a login accepted code",
  type: 'warning',
};

export const SIGNED_CODE_ERROR: ScanStatus = {
  title: 'Error, Watch out!!!',
  message:
    'This code has already been scanned by someone else, your account may be in danger',
  type: 'error',
};

export const SERVER_ERROR: ScanStatus = {
  title: 'Server Error',
  message: 'Some went wrong, try again later',
  type: 'error',
};

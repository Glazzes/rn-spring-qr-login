import {API_URL} from '@env';

// Auth
export const apiAuthLogin = '/api/v1/auth/login';
export const apiTokenUrl = '/api/v1/auth/token';

// users
export const apiUsersUrl = '/api/v1/users';
export const apiUsersMeUrl = `${apiUsersUrl}/me`;
export const apiUsersExistsByEmailUrl = `${apiUsersUrl}/exists`;
export const apiUsersValidateUrl = `${apiUsersUrl}/validate`;

// events
const apiEvents = '/api/v1/events';
export const apiSaveQRCodeUrl = '/api/v1/qrcode';

export const qrLoginPerformEventUrl = (id: String): string => {
  return `${apiEvents}/${id}/login-perform`;
};

export const qrCancelLoginEventUrl = (id: string): string => {
  return `${apiEvents}/${id}/login-cancel`;
};

export const displayUserEventUrl = (id: string): string => {
  return `${apiEvents}/${id}/display-user`;
};

// Misc
export const getProfilePictureUrl = (filename: string): string => {
  return `${API_URL}/static/${filename}`;
};

import {API_URL} from '@env';

export const apiAuthLogin = '/api/v1/auth/login';
export const apiTokenUrl = '/api/v1/auth/token';
export const qrLogin = '/api/v1/auth/login-qr';

export const loggedInUser = '/api/v1/users/me';

export const deleteSourceUrl = (id: string): string => {
  return `/api/v1/events/${id}`;
}

export const getProfilePictureUrl = (filename: string): string => {
  return `${API_URL}/static/${filename}`;
}

export const getEventSourceUrl = (id: string): string => {
  return `${API_URL}/api/v1/events/${id}/register`;
}

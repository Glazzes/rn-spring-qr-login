// Auth
export const apiAuthLogin = '/api/v1//auth/login';

// users
export const apiUsersUrl = '/api/v1/users';
export const apiUsersMeUrl = `${apiUsersUrl}/me`;

// events
const apiEvents = '/api/v1/events';
export const registerEventSource = `${apiEvents}/register`;
export const saveQrCodeUrl = '/api/v1/qrcode';
export const passwordLogin = '$/api/v1/auth/login';

export const qrLoginPerformEventUrl = (id: String): string => {
  return `${apiEvents}/${id}/login-perform`;
};

export const qrCancelLoginEventUrl = (id: string): string => {
  return `${apiEvents}/${id}/login-cancel`;
};

export const userShowEventUrl = (id: string): string => {
  return `${apiEvents}/${id}/user-show`;
};

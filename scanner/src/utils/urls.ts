const BASE = 'http://192.168.42.154:8080';
const EVENTS = `${BASE}/api/v1/events`;
const USERS = `${BASE}/api/v1/users`;

export const passwordLogin = `${BASE}/api/v1/auth/login`;
export const me = `${USERS}/me`;
export const registerEventSource = `${EVENTS}/register`;

export const saveQrCodeUrl = `${BASE}/api/v1/qrcode`;

// events
export function qrLoginPerformEventUrl(id: String): string {
  return `${EVENTS}/${id}/login-perform`;
}

export function qrCancelLoginEventUrl(id: string): string {
  return `${EVENTS}/${id}/login-cancel`;
}

export function userShowEventUrl(id: string): string {
  return `${EVENTS}/${id}/user-show`;
}

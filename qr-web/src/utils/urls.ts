const BASE = "http://localhost:8080";
const EVENTS = `${BASE}/api/v1/events`;

export const qrLogin = `${BASE}/api/v1/login/qr`;
export const passwordLogin = `${BASE}/api/v1/auth/login`;

export const loggedInUser = `${BASE}/api/v1/users/me`;

export function deleteEventUrl(id: string): string {
  return `${EVENTS}/${id}`;
}

export function getEventSourceUrl(id: string): string {
  return `${EVENTS}/${id}/register`;
}

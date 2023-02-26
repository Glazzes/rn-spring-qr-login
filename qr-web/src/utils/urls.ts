const host = "http://localhost:8080";
const events = `${host}/api/v1/events`;

export const qrLogin = `${host}/api/v1/login/qr`;
export const passwordLogin = `${host}/api/v1/auth/login`;

export const loggedInUser = `${host}/api/v1/users/me`;

export function deleteEventUrl(id: string): string {
  return `${events}/${id}`;
}

export function getEventSourceUrl(id: string): string {
  return `${events}/${id}/register`;
}

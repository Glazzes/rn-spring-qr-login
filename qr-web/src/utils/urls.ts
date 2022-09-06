const BASE = "http://localhost:8080";
const EMITTER_BASE = `${BASE}/api/v1/events`;

export const qrLogin = `${BASE}/api/v1/login/qr`;

export function getEventSourceUrl(id: string): string {
  return `${EMITTER_BASE}/${id}/register`;
}

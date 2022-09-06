const MINUTE = 60;

export function converTimeToTextTime(currentTime: number): string {
  "worklet";
  const minutes = Math.floor(currentTime / MINUTE);
  const seconds = currentTime % MINUTE;

  return `${minutes > 0 ? minutes + ":" : 0}${seconds}`;
}

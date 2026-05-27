export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

export function dispatchAuthUnauthorizedEvent() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
}

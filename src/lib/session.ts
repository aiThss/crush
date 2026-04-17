// Generates & caches a session ID in sessionStorage
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem("__vibe_sid");
    if (!sid) {
      sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("__vibe_sid", sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function getDevice(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

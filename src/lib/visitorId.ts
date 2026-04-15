const STORAGE_KEY = "elise_visitor_id";

export function getVisitorId(): string {
  let visitorId: string | null = null;
  try {
    visitorId = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage may be unavailable in private mode
  }

  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    try {
      localStorage.setItem(STORAGE_KEY, visitorId);
    } catch {
      // ignore
    }
  }

  return visitorId;
}

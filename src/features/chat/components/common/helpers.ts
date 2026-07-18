/** Utility functions for chat display formatting */

/** Format an ISO timestamp to locale time string @param isoString - ISO 8601 date @returns Formatted time (HH:mm) */
export function formatMessageTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

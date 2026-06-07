/** Utility functions for chat display formatting */

/** Format an ISO timestamp to locale time string @param isoString - ISO 8601 date @returns Formatted time (HH:mm) */
export function formatMessageTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format byte count to human-readable size @param bytes - File size in bytes @returns e.g. "1.5 MB" */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Format seconds to M:SS duration string @param seconds - Total seconds @returns e.g. "3:45" */
export function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

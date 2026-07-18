/** String normalization utilities. */
/** Normalize text for case-insensitive, accent-insensitive search. Strips diacritics and lowercases. @param value Raw string. @returns Normalized lowercase string. */
export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

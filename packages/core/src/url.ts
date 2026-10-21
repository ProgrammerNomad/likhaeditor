/** URL policy shared by HTML parsing, serialization, and insertion commands. */
export function isSafeURL(value: unknown, image = false): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  const normalized = value.replace(/[\u0000-\u0020\u007f]/g, '');
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(normalized)?.[1].toLowerCase();
  if (!scheme) return true;
  return (image ? ['http', 'https', 'blob'] : ['http', 'https', 'mailto', 'tel']).includes(scheme);
}

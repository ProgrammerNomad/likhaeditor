/** URL policy shared by HTML parsing, serialization, and insertion commands. */
export function isSafeURL(value: unknown, image = false): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  const normalized = Array.from(value).filter(char => char.charCodeAt(0) > 32 && char.charCodeAt(0) !== 127).join('');
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(normalized)?.[1].toLowerCase();
  if (!scheme) return true;
  return (image ? ['http', 'https', 'blob'] : ['http', 'https', 'mailto', 'tel']).includes(scheme);
}

const EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
]);

/** HTTPS embed iframes from supported video hosts. */
export function isSafeEmbedURL(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
    return EMBED_HOSTS.has(url.hostname) && url.pathname.startsWith('/embed');
  } catch {
    return false;
  }
}

/** Convert common watch URLs into embed-safe iframe sources. */
export function toEmbedURL(value: string): string | null {
  try {
    const url = new URL(value);
    if (EMBED_HOSTS.has(url.hostname) && url.pathname.startsWith('/embed')) return url.toString();
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.hostname.includes('youtube.com') && url.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${url.searchParams.get('v')}`;
    }
    if (url.hostname === 'vimeo.com') {
      const id = url.pathname.replace(/^\//, '');
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return isSafeEmbedURL(value) ? value : null;
}

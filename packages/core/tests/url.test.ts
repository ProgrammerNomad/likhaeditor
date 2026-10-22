import { describe, expect, it } from 'vitest';
import { isSafeEmbedURL, toEmbedURL } from '../src/url';

describe('embed URLs', () => {
  it('accepts known embed hosts', () => {
    expect(isSafeEmbedURL('https://www.youtube.com/embed/abc123')).toBe(true);
    expect(isSafeEmbedURL('http://www.youtube.com/embed/abc123')).toBe(false);
  });

  it('converts watch URLs', () => {
    expect(toEmbedURL('https://www.youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    );
  });
});

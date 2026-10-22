export const FONT_FAMILIES = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Tahoma', 'Trebuchet MS'] as const;
export function fontFamily(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const clean = value.replace(/["']/g, '').trim().toLowerCase();
  return FONT_FAMILIES.find(font => font.toLowerCase() === clean) ?? null;
}
export function fontSize(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 8 && value <= 72 ? value : null;
}

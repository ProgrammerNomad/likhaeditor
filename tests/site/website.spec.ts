import { test, expect } from '@playwright/test';

test('playground edits, exports, resets and toggles read-only', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/playground');
  const editor = page.getByRole('textbox', { name: 'Rich text editor' });
  await expect(editor).toBeVisible();
  await editor.fill('Website integration works');
  await page.getByRole('button', { name: 'Export JSON', exact: true }).click();
  const exported = page.getByRole('textbox', { name: 'Exported content' });
  expect(JSON.parse(await exported.inputValue()).type).toBe('doc');
  await page.getByRole('button', { name: 'Read-only', exact: true }).click();
  await expect(editor).toHaveAttribute('contenteditable', 'false');
  await page.getByRole('button', { name: 'Enable editing', exact: true }).click();
  await expect(editor).toHaveAttribute('contenteditable', 'true');
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(editor).toContainText('Your words. Your infrastructure.');
  await page.getByRole('button', { name: 'Export Markdown', exact: true }).click();
  await expect(exported).toHaveValue(/Your words/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('playground.png'), fullPage: true });
});

test('original VitePress homepage and release documentation render', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.VPHero')).toContainText('Modern Rich Text Editor');
  await expect(page.locator('.VPFeature')).toHaveCount(9);
  await expect(page.getByRole('link', { name: 'Interactive Playground', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('homepage.png'), fullPage: true });
  for (const path of ['/status', '/guide/professional-editing', '/guide/self-hosting']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  }
});

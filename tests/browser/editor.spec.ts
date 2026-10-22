import { test, expect, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import type { createEditor } from '../../packages/html/src/index';

declare global {
  interface Window {
    LikhaEditor: { createEditor: typeof createEditor };
    instance: ReturnType<typeof createEditor>;
  }
}

async function setup(page: Page, options: Record<string, unknown> = {}) {
  await page.setContent('<div id="editor"></div>');
  await page.addStyleTag({ path: resolve('packages/html/dist/likha-editor.css') });
  await page.addScriptTag({ path: resolve('packages/html/dist/likha-editor.umd.js') });
  await page.evaluate(options => {
    window.instance = window.LikhaEditor.createEditor({ element: '#editor', ...options });
  }, options);
}

for (const darkTheme of [false, true]) {
  test(`automated accessibility checks for editor and dialog (dark=${darkTheme})`, async ({ page }) => {
    await setup(page, { darkTheme, content: '<p>Accessible editor</p>', comments: { author: 'Reviewer' }, trackChanges: {} });
    const scan = () => new AxeBuilder({ page }).include('#editor').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect((await scan()).violations).toEqual([]);
    await page.getByRole('button', { name: 'Insert Image', exact: true }).click();
    const dialog = await new AxeBuilder({ page }).include('.likha-dialog').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(dialog.violations).toEqual([]);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  });
}

test('review panel accepts and rejects tracked edits', async ({ page }) => {
  await setup(page, { content: '<p>Hello</p>', trackChanges: { author: 'Reviewer' } });
  const area = page.getByRole('textbox', { name: 'Rich text editor' });
  await area.click();
  await area.press('ControlOrMeta+End');
  await area.press('!');
  await page.getByRole('button', { name: 'Review tracked changes' }).click();
  await expect(page.getByRole('region', { name: 'Review changes' })).toContainText('After: !');
  await page.getByRole('button', { name: 'Reject change by Reviewer' }).click();
  await expect(area).toHaveText('Hello');
  await expect(page.getByRole('region', { name: 'Review changes' })).toContainText('No pending changes.');
});

test('large document stays within editor performance budgets', async ({ page }, testInfo) => {
  await setup(page);
  const metrics = await page.evaluate(() => {
    const content = Array.from({ length: 1000 }, (_, index) => `<p>Paragraph ${index}: ${'Sample words for editing. '.repeat(10)}</p>`).join('');
    let start = performance.now(); window.instance.setContent(content); const loadMs = performance.now() - start;
    const transactions: number[] = [];
    for (let i = 0; i < 20; i++) {
      start = performance.now();
      const { state } = window.instance.editor.view;
      window.instance.editor.view.dispatch(state.tr.insertText('x', 1));
      transactions.push(performance.now() - start);
    }
    start = performance.now(); const html = window.instance.getContent(); const serializeMs = performance.now() - start;
    transactions.sort((a, b) => a - b);
    return { paragraphs: 1000, characters: html.length, loadMs, serializeMs, p95TransactionMs: transactions[18] };
  });
  await testInfo.attach('performance.json', { body: JSON.stringify(metrics, null, 2), contentType: 'application/json' });
  expect(metrics.loadMs).toBeLessThan(15000);
  expect(metrics.serializeMs).toBeLessThan(5000);
  expect(metrics.p95TransactionMs).toBeLessThan(500);
});

test('standalone bundle edits offline, formats, undoes, and destroys', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.abort());
  await setup(page);
  const area = page.getByRole('textbox', { name: 'Rich text editor' });
  await area.fill('Hello world');
  await area.press('ControlOrMeta+a');
  await page.getByRole('button', { name: 'Bold (Ctrl+B)', exact: true }).click();
  await expect(area.locator('strong')).toHaveText('Hello world');
  await page.getByRole('button', { name: 'Undo (Ctrl+Z)', exact: true }).click();
  await expect(area.locator('strong')).toHaveCount(0);
  await page.evaluate(() => window.instance.destroy());
  await expect(page.locator('#editor')).toBeEmpty();
  expect(errors).toEqual([]);
});

test('link dialog validates URL and preserves selected text', async ({ page }) => {
  await setup(page);
  const area = page.getByRole('textbox', { name: 'Rich text editor' });
  await area.fill('Link text'); await area.press('ControlOrMeta+a');
  await page.getByRole('button', { name: 'Insert Link (Ctrl+K)' }).click();
  await page.getByLabel('Link URL', { exact: true }).fill('javascript:alert(1)');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('supported URL');
  await page.getByLabel('Link URL', { exact: true }).fill('https://example.com');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(area.locator('a')).toHaveAttribute('href', 'https://example.com');
  await expect(area.locator('a')).toHaveText('Link text');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('keyboard style menu and table picker work', async ({ page }) => {
  await setup(page);
  await page.getByRole('textbox', { name: 'Rich text editor' }).fill('Title');
  const styles = page.getByRole('button', { name: 'Paragraph', exact: true });
  await styles.focus(); await styles.press('ArrowDown');
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
  await expect(page.locator('.ProseMirror h1')).toHaveText('Title');
  await page.getByRole('button', { name: 'Insert Table', exact: true }).click();
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
  await expect(page.locator('.ProseMirror tr')).toHaveCount(2);
  await expect(page.locator('.ProseMirror td')).toHaveCount(4);
});

test('read-only mode, placeholders, and separate instances', async ({ page }) => {
  await setup(page, { editable: false, placeholder: 'First editor', darkTheme: true });
  await expect(page.locator('.ProseMirror')).toHaveAttribute('contenteditable', 'false');
  await expect(page.locator('#editor')).toHaveClass(/likha-dark/);
  await expect(page.locator('[data-placeholder]')).toHaveAttribute('data-placeholder', 'First editor');
  await page.evaluate(() => {
    const element = document.createElement('div'); element.id = 'second'; document.body.appendChild(element);
    window.LikhaEditor.createEditor({ element, placeholder: 'Second editor', toolbar: false });
    window.instance.setEditable(true);
  });
  await page.locator('#editor .ProseMirror').fill('Edited');
  await expect(page.locator('#second [data-placeholder]')).toHaveAttribute('data-placeholder', 'Second editor');
  await expect(page.locator('#editor [data-placeholder]')).toHaveCount(0);
});

test('source mode preserves whitespace and cleans up on destroy', async ({ page }) => {
  await setup(page, { content: '<p>a<strong>b</strong>c</p><pre><code>  a\n    b</code></pre>' });
  const original = await page.evaluate(() => window.instance.getContent());
  await page.getByRole('button', { name: 'HTML Source View', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'HTML source', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'HTML Source View', exact: true }).click();
  expect(await page.evaluate(() => window.instance.getContent())).toBe(original);
  await page.getByRole('button', { name: 'Insert Image', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.evaluate(() => window.instance.destroy());
  await expect(page.locator('#editor')).toBeEmpty();
});

test('table actions and find/replace change the document', async ({ page }) => {
  await setup(page, { content: '<table><tr><td><p>hello</p></td><td><p>hello</p></td></tr></table>' });
  await page.locator('.ProseMirror td').first().click();
  await page.getByRole('button', { name: 'Table actions', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Insert row below', exact: true }).click();
  await expect(page.locator('.ProseMirror tr')).toHaveCount(2);
  await page.getByRole('button', { name: 'Replace text', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Find text', { exact: true }).fill('hello');
  await page.getByLabel('Replace with', { exact: true }).fill('world');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.locator('.ProseMirror')).toContainText('world');
  await expect(page.locator('.ProseMirror')).not.toContainText('hello');
});

test('HTML paste pipeline strips unsafe URLs and preserves basic formatting', async ({ page }) => {
  await setup(page);
  await page.getByRole('textbox', { name: 'Rich text editor' }).focus();
  await page.evaluate(() => {
    window.instance.editor.view.pasteHTML('<p><strong>Bold</strong> <a href="javascript:alert(1)">unsafe</a><img src="javascript:alert(1)"></p>');
  });
  await expect(page.locator('.ProseMirror strong')).toHaveText('Bold');
  const html = await page.evaluate(() => window.instance.getContent());
  expect(html).not.toContain('javascript:');
  expect(html).toContain('unsafe');
});

test('comment panel renders plain text and resolves a selected annotation', async ({ page }) => {
  await setup(page, { comments: { author: 'Reviewer' } });
  const area = page.getByRole('textbox', { name: 'Rich text editor' });
  await area.fill('Review this'); await area.press('ControlOrMeta+a');
  await page.getByRole('button', { name: 'Add comment', exact: true }).click();
  await page.getByLabel('Comment text', { exact: true }).fill('<img onerror=alert(1)> Please revise');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(area.locator('.likha-comment-anchor')).toHaveText('Review this');
  await page.getByRole('button', { name: 'Show comments', exact: true }).click();
  const panel = page.getByRole('region', { name: 'Comments', exact: true });
  await expect(panel).toContainText('<img onerror=alert(1)> Please revise');
  await expect(panel.locator('img')).toHaveCount(0);
  await panel.getByRole('button', { name: 'Resolve', exact: true }).click();
  await expect(area.locator('.likha-comment-anchor')).toHaveCount(0);
  await page.evaluate(() => window.instance.destroy());
  await expect(panel).toHaveCount(0);
});

test('self-hosted upload adapter inserts an image from a selected file', async ({ page }) => {
  await setup(page);
  await page.evaluate(() => {
    window.instance.destroy();
    window.instance = window.LikhaEditor.createEditor({ element: '#editor', imageUpload: {
      upload: async file => ({ src: '/uploads/' + file.name, alt: 'Uploaded image' }),
    } });
  });
  await page.locator('input[type=file]').setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('test image payload') });
  await expect(page.getByRole('img', { name: 'Uploaded image' })).toHaveAttribute('src', '/uploads/photo.png');
  await expect(page.getByRole('status')).toHaveText('Image uploaded');
});

test('empty plugin selection hides unavailable controls', async ({ page }) => {
  await setup(page, { plugins: [] });
  await expect(page.getByRole('button', { name: 'Insert Link (Ctrl+K)' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'HTML Source View' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Bold (Ctrl+B)' })).toBeVisible();
});

test.describe('narrow viewport', () => {
test.use({ viewport: { width: 390, height: 844 } });
test('mobile viewport keeps toolbar usable and supports non-Latin text', async ({ page }) => {
  await setup(page);
  await page.getByRole('textbox', { name: 'Rich text editor' }).fill('नमस्ते 世界 😊');
  expect(await page.evaluate(() => window.instance.getText())).toBe('नमस्ते 世界 😊');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: 'Insert Image', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Rich text editor' })).toBeFocused();
});
});

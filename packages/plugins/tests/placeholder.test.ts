import { afterEach, expect, it } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { PlaceholderPlugin } from '../src/placeholder';
const editors: Editor[] = [];
afterEach(() => editors.splice(0).forEach(editor => editor.destroy()));
it('shows distinct placeholders and removes them when typing', () => {
  for (const text of ['First editor', 'Second "quoted" editor']) {
    const editor = new Editor({ element: document.createElement('div'), plugins: [new PlaceholderPlugin({ text })] });
    editors.push(editor);
    expect(editor.view.dom.querySelector('p')?.getAttribute('data-placeholder')).toBe(text);
    editor.setContent('<p>Written</p>');
    expect(editor.view.dom.querySelector('[data-placeholder]')).toBeNull();
    editor.setContent('');
    expect(editor.view.dom.querySelector('[data-placeholder]')).not.toBeNull();
  }
});
it('does not add global styles or export placeholder attributes', () => {
  const count = document.head.querySelectorAll('style').length;
  const editor = new Editor({ element: document.createElement('div'), plugins: [new PlaceholderPlugin()] });
  editors.push(editor);
  expect(editor.getHTML()).toBe('<p></p>');
  expect(document.head.querySelectorAll('style')).toHaveLength(count);
});

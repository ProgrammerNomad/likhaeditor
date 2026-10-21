import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor, Plugin, isSafeURL } from '../src/index';
import { Schema } from 'prosemirror-model';

let editor: Editor;
afterEach(() => editor?.destroy());
function setup(content = '<p>Hello</p>', plugins: Plugin[] = []) {
  editor = new Editor({ element: document.createElement('div'), content, plugins });
  return editor;
}

describe('release regressions', () => {
  it.each(['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'java\nscript:alert(1)', 'data:text/html,hello', 'vbscript:msgbox(1)'])('rejects unsafe links: %s', url => {
    expect(isSafeURL(url)).toBe(false);
    setup(`<p><a href="${url}">text</a><img src="${url}"></p>`);
    expect(editor.getHTML()).toBe('<p>text</p>');
  });
  it.each(['https://example.com', '/articles/1', '#section', 'mailto:a@example.com', 'tel:+123'])('preserves supported links: %s', url => {
    expect(isSafeURL(url)).toBe(true);
  });
  it('guards serialization against unsafe URLs inserted through transactions', () => {
    setup();
    const { state } = editor.view;
    editor.view.dispatch(state.tr.addMark(1, 3, state.schema.marks.link.create({ href: 'javascript:alert(1)' })));
    expect(editor.getHTML()).not.toContain('javascript:');
  });
  it('cleans plugins exactly once', () => {
    class CleanupPlugin extends Plugin { name = 'cleanup'; destroy = vi.fn(); }
    const plugin = new CleanupPlugin();
    setup('', [plugin]);
    editor.destroy();
    editor.destroy();
    expect(plugin.destroy).toHaveBeenCalledTimes(1);
  });
  it('reports stored marks at an empty cursor and supports toolbar aliases', () => {
    setup();
    editor.bold();
    expect(editor.isActive('bold')).toBe(true);
    expect(editor.isActive('strong')).toBe(true);
    editor.bold();
    expect(editor.isActive('bold')).toBe(false);
  });
  it('accepts a minimal custom schema without lists or formatting marks', () => {
    editor = new Editor({ element: document.createElement('div'), schema: new Schema({
      nodes: { doc: { content: 'paragraph+' }, paragraph: { content: 'text*', toDOM: () => ['p', 0] }, text: {} },
    }) });
    expect(editor.getHTML()).toBe('<p></p>');
  });
  it('separates blocks in plain text output', () => {
    setup('<p>one</p><p>two</p>');
    expect(editor.getText()).toBe('one\ntwo');
  });
});

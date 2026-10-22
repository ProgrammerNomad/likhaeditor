import { afterEach, expect, it } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { TextSelection } from 'prosemirror-state';
import { TypographyPlugin } from '../src/typography';
let editor: Editor;
afterEach(() => editor?.destroy());
it('formats selected text and roundtrips typography through HTML and JSON', () => {
  editor = new Editor({ element: document.createElement('div'), content: '<p>Example</p>', plugins: [new TypographyPlugin()] });
  editor.view.dispatch(editor.view.state.tr.setSelection(TextSelection.create(editor.view.state.doc, 1, 8)));
  expect(editor.executeCommand('setFontFamily', 'Georgia')).toBe(true);
  expect(editor.executeCommand('setFontSize', 24)).toBe(true);
  const html = editor.getHTML();
  expect(html).toContain('Georgia'); expect(html).toContain('24pt');
  editor.setContent(html); expect(editor.getHTML()).toBe(html);
  editor.setJSON(editor.getJSON()); expect(editor.getHTML()).toBe(html);
  editor.view.dispatch(editor.view.state.tr.setSelection(TextSelection.create(editor.view.state.doc, 1, 8)));
  editor.executeCommand('setFontSize', null); expect(editor.getHTML()).not.toContain('font-size');
});
it('rejects unsafe style values and invalid imported JSON attributes', () => {
  editor = new Editor({ element: document.createElement('div'), plugins: [new TypographyPlugin()] });
  expect(editor.executeCommand('setFontFamily', 'Arial; background: url(https://example.com)')).toBe(false);
  expect(editor.executeCommand('setFontSize', 9999)).toBe(false);
  expect(() => editor.setJSON({ type: 'doc', content: [{ type: 'paragraph', content: [
    { type: 'text', text: 'bad', marks: [{ type: 'fontSize', attrs: { size: -1 } }] },
  ] }] })).toThrow('Unsupported font size');
});

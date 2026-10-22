import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { TextSelection } from 'prosemirror-state';
import { CellSelection } from 'prosemirror-tables';
import { TablePlugin } from '../src/table';
import { FindReplacePlugin } from '../src/find-replace';
import { MarkdownPlugin } from '../src/markdown';

let editor: Editor;
afterEach(() => editor?.destroy());
function setup(content: string) {
  editor = new Editor({ element: document.createElement('div'), content, plugins: [new TablePlugin(), new FindReplacePlugin(), new MarkdownPlugin()] });
}
function cellPositions() {
  const positions: number[] = [];
  editor.view.state.doc.descendants((node, pos) => { if (node.type.spec.tableRole === 'cell' || node.type.spec.tableRole === 'header_cell') positions.push(pos); });
  return positions;
}
function selectCell(index = 0) {
  editor.view.dispatch(editor.view.state.tr.setSelection(TextSelection.create(editor.view.state.doc, cellPositions()[index] + 2)));
}

describe('table editing', () => {
  it('adds and deletes rows and columns, preserves headers, and undoes', () => {
    setup('<table><tr><td><p>A</p></td><td><p>B</p></td></tr><tr><td><p>C</p></td><td><p>D</p></td></tr></table>');
    selectCell();
    expect(editor.executeCommand('addRowAfter')).toBe(true);
    expect(editor.view.state.doc.firstChild?.childCount).toBe(3);
    expect(editor.undo()).toBe(true);
    expect(editor.view.state.doc.firstChild?.childCount).toBe(2);
    selectCell();
    editor.executeCommand('addColumnAfter');
    expect(cellPositions()).toHaveLength(6);
    editor.executeCommand('deleteColumn');
    expect(cellPositions()).toHaveLength(4);
    editor.executeCommand('toggleHeaderRow');
    expect(editor.getHTML()).toContain('<th>');
    editor.executeCommand('deleteRow');
    expect(editor.view.state.doc.firstChild?.childCount).toBe(1);
    editor.executeCommand('deleteTable');
    expect(editor.getHTML()).not.toContain('<table>');
  });
  it('merges and splits a cell selection without discarding content', () => {
    setup('<table><tr><td><p>A</p></td><td><p>B</p></td></tr></table>');
    const positions = cellPositions();
    editor.view.dispatch(editor.view.state.tr.setSelection(CellSelection.create(editor.view.state.doc, positions[0], positions[1])));
    expect(editor.executeCommand('mergeCells')).toBe(true);
    expect(editor.getHTML()).toContain('colspan="2"');
    expect(editor.getText()).toContain('A'); expect(editor.getText()).toContain('B');
    expect(editor.executeCommand('splitCell')).toBe(true);
    expect(cellPositions()).toHaveLength(2);
  });
  it('rejects invalid sizes without mutating content', () => {
    setup('<p>Keep me</p>');
    for (const rows of [0, -1, 1.5, Infinity, NaN, 1001]) expect(editor.executeCommand('insertTable', rows, 2)).toBe(false);
    expect(editor.getHTML()).toBe('<p>Keep me</p>');
  });
});

describe('find/replace and import/export', () => {
  it('finds across formatting, respects block boundaries, treats regex characters literally', () => {
    setup('<p>hel<strong>lo</strong> Hello [x]</p><p>hello</p>');
    const plugin = editor.getPlugin('findReplace') as FindReplacePlugin;
    expect(plugin.find(editor, 'hello')).toHaveLength(3);
    expect(plugin.find(editor, 'hello', true)).toHaveLength(2);
    expect(plugin.find(editor, '[x]')).toHaveLength(1);
    expect(plugin.find(editor, '[x]hello')).toHaveLength(0);
    expect(plugin.replaceAll(editor, 'hello', 'hi')).toBe(3);
    expect(editor.getText()).toBe('hi hi [x]\nhi');
    editor.undo(); expect(editor.getHTML()).toContain('<strong>lo</strong>');
  });
  it('round trips JSON, validates schema and rejects dangerous URLs', () => {
    setup('<h2>Hello</h2><p><strong>World</strong></p>');
    const json = editor.getJSON();
    editor.setContent(''); editor.setJSON(json);
    expect(editor.getJSON()).toEqual(json);
    expect(() => editor.setJSON({ type: 'missing' })).toThrow();
    expect(() => editor.setJSON({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] }] }] })).toThrow('Unsupported link URL');
    expect(editor.getJSON()).toEqual(json);
  });
  it('imports and exports CommonMark including code language and nested lists', () => {
    setup('');
    const markdown = '# Heading\n\n**bold** and *italic*\n\n- one\n  - two\n\n```js\nconst x = 1;\n```';
    editor.executeCommand('importMarkdown', markdown);
    expect(editor.getHTML()).toContain('language-js');
    const exported = editor.executeCommand('exportMarkdown') as string;
    expect(exported).toContain('```js'); expect(exported).toContain('**bold**');
    const json = editor.getJSON();
    editor.executeCommand('importMarkdown', exported);
    expect(editor.getJSON()).toEqual(json);
  });
  it('fails unsupported Markdown export rather than silently dropping rich content', () => {
    setup('<p><u>Underline</u></p>');
    expect(() => editor.executeCommand('exportMarkdown')).toThrow();
  });
});

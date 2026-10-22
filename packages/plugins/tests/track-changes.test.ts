import { afterEach, expect, it, vi } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { TrackChangesPlugin } from '../src/track-changes';
let editor: Editor;
function setup(content = '<p>Hello world</p>') {
  const onChange = vi.fn();
  const plugin = new TrackChangesPlugin({ author: 'Reviewer', onChange });
  editor = new Editor({ element: document.createElement('div'), content, plugins: [plugin] });
  return { plugin, onChange };
}
afterEach(() => editor?.destroy());

it('records insertion metadata and rejects without recording its own inverse', () => {
  const { plugin, onChange } = setup();
  editor.view.dispatch(editor.view.state.tr.insertText('!', 12));
  const [change] = plugin.listChanges(editor);
  expect(change).toMatchObject({ author: 'Reviewer', before: '', after: '!', conflicted: false });
  expect(onChange).toHaveBeenCalled();
  expect(plugin.rejectChange(editor, change.id)).toBe(true);
  expect(editor.getText()).toBe('Hello world');
  expect(plugin.listChanges(editor)).toEqual([]);
});

it('rejects an older change through a later disjoint insertion', () => {
  const { plugin } = setup();
  editor.view.dispatch(editor.view.state.tr.insertText('!', 12));
  const [first] = plugin.listChanges(editor);
  editor.view.dispatch(editor.view.state.tr.insertText('Hi ', 1));
  expect(plugin.rejectChange(editor, first.id)).toBe(true);
  expect(editor.getText()).toBe('Hi Hello world');
  expect(plugin.listChanges(editor)).toHaveLength(1);
});

it('restores deleted text and reverts formatting', () => {
  const { plugin } = setup();
  editor.view.dispatch(editor.view.state.tr.delete(7, 12));
  expect(plugin.listChanges(editor)[0].before).toBe('world');
  plugin.rejectChange(editor, plugin.listChanges(editor)[0].id);
  editor.view.dispatch(editor.view.state.tr.addMark(1, 6, editor.view.state.schema.marks.strong.create()));
  expect(editor.getHTML()).toContain('<strong>');
  plugin.rejectChange(editor, plugin.listChanges(editor)[0].id);
  expect(editor.getHTML()).toBe('<p>Hello world</p>');
});

it('rejects multi-step transactions in reverse order', () => {
  const { plugin } = setup();
  editor.view.dispatch(editor.view.state.tr.insertText('!', 12).insertText('Hi ', 1));
  expect(plugin.listChanges(editor)).toHaveLength(1);
  plugin.rejectChange(editor, plugin.listChanges(editor)[0].id);
  expect(editor.getText()).toBe('Hello world');
});

it('blocks destructive rejection after overlapping edits, accepts without altering content', () => {
  const { plugin } = setup();
  editor.view.dispatch(editor.view.state.tr.insertText('abc', 1));
  const id = plugin.listChanges(editor)[0].id;
  editor.view.dispatch(editor.view.state.tr.insertText('X', 2));
  const html = editor.getHTML();
  expect(() => plugin.rejectChange(editor, id)).toThrow('overlaps');
  expect(editor.getHTML()).toBe(html);
  expect(plugin.acceptChange(editor, id)).toBe(true);
  expect(editor.getHTML()).toBe(html);
});

it('maps pending review through edits while recording is disabled', () => {
  const { plugin } = setup();
  editor.view.dispatch(editor.view.state.tr.insertText('!', 12));
  const id = plugin.listChanges(editor)[0].id;
  plugin.setTracking(editor, false);
  editor.view.dispatch(editor.view.state.tr.insertText('Hi ', 1));
  expect(plugin.listChanges(editor)).toHaveLength(1);
  expect(plugin.isTracking(editor)).toBe(false);
  plugin.rejectChange(editor, id);
  expect(editor.getText()).toBe('Hi Hello world');
  expect(plugin.acceptChange(editor, 'unknown')).toBe(false);
});

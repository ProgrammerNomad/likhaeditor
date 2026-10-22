import { afterEach, expect, it } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { createVersionHistory, localVersionStore } from '../src/version-history';
let editor: Editor;
afterEach(() => { editor?.destroy(); localStorage.clear(); });
it('persists checkpoints, restores with undo, and isolates documents', async () => {
  editor = new Editor({ element: document.createElement('div'), content: '<p>First</p>' });
  const history = createVersionHistory(editor, localVersionStore('document-a'));
  const first = await history.save('Draft');
  editor.setContent('<p>Second</p>');
  expect((await history.list())[0].document).toEqual(first.document);
  expect(await localVersionStore('document-b').list()).toEqual([]);
  await history.restore(first.id);
  expect(editor.getText()).toBe('First');
  await history.remove(first.id);
  expect(await history.list()).toEqual([]);
  await expect(history.restore('missing')).rejects.toThrow('Version not found');
});
it('rejects malformed persisted history without overwriting it', async () => {
  localStorage.setItem('broken', '{"bad":true}');
  await expect(localVersionStore('broken').list()).rejects.toThrow('Invalid version history');
  expect(localStorage.getItem('broken')).toBe('{"bad":true}');
});

import { afterEach, expect, it, vi } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { ImageUploadPlugin } from '../src/image-upload';

let editor: Editor;
afterEach(() => editor?.destroy());
const file = () => new File(['image'], 'photo.png', { type: 'image/png' });
it('maps upload insertion through edits made while the request is pending', async () => {
  let complete: (value: { src: string }) => void = () => {};
  const plugin = new ImageUploadPlugin({ upload: () => new Promise(resolve => { complete = resolve; }) });
  editor = new Editor({ element: document.createElement('div'), content: '<p>abc</p>', plugins: [plugin] });
  const pending = plugin.uploadImage(editor, file(), 2);
  editor.view.dispatch(editor.view.state.tr.insertText('X', 1));
  complete({ src: '/uploads/photo.png' });
  expect(await pending).toBe(true);
  expect(editor.getHTML()).toBe('<p>Xa<img src="/uploads/photo.png">bc</p>');
});
it('aborts on destroy and prevents late insertion', async () => {
  let signal: AbortSignal | undefined;
  let complete: (value: { src: string }) => void = () => {};
  const plugin = new ImageUploadPlugin({ upload: (_file, abortSignal) => { signal = abortSignal; return new Promise(resolve => { complete = resolve; }); } });
  editor = new Editor({ element: document.createElement('div'), plugins: [plugin] });
  const pending = plugin.uploadImage(editor, file());
  editor.destroy(); expect(signal?.aborted).toBe(true);
  complete({ src: '/photo.png' });
  expect(await pending).toBe(false);
});
it('rejects invalid files and unsafe server URLs', async () => {
  const upload = vi.fn().mockResolvedValue({ src: 'javascript:alert(1)' });
  const plugin = new ImageUploadPlugin({ upload, maxBytes: 10 });
  editor = new Editor({ element: document.createElement('div'), plugins: [plugin] });
  await expect(plugin.uploadImage(editor, new File(['<svg/>'], 'x.svg', { type: 'image/svg+xml' }))).rejects.toThrow('Unsupported image type');
  expect(upload).not.toHaveBeenCalled();
  await expect(plugin.uploadImage(editor, file())).rejects.toThrow('unsupported image URL');
  expect(editor.getHTML()).toBe('<p></p>');
});

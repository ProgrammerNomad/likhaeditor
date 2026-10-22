import { describe, expect, it } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { EmbedPlugin } from '../src/embed';

describe('EmbedPlugin', () => {
  it('inserts a validated iframe block', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const editor = new Editor({
      element,
      plugins: [new EmbedPlugin()],
    });
    const ok = editor.executeCommand(
      'insertEmbed',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );
    expect(ok).toBe(true);
    expect(editor.getHTML()).toContain('youtube.com/embed/dQw4w9WgXcQ');
    editor.destroy();
    element.remove();
  });
});

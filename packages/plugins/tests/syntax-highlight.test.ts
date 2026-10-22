import { afterEach, expect, it } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { SyntaxHighlightPlugin } from '../src/syntax-highlight';
let editor: Editor;
afterEach(() => editor?.destroy());
it('decorates code without polluting serialized content and updates on edits', () => {
  editor = new Editor({ element: document.createElement('div'),
    content: '<pre><code class="language-javascript">const value = 1;</code></pre>', plugins: [new SyntaxHighlightPlugin()] });
  expect(editor.view.dom.querySelector('.hljs-keyword')?.textContent).toBe('const');
  expect(editor.getHTML()).not.toContain('hljs');
  editor.view.dispatch(editor.view.state.tr.insertText('// ', 1));
  expect(editor.view.dom.querySelector('.hljs-comment')).not.toBeNull();
});
it('keeps unknown languages and markup-like code as plain text', () => {
  editor = new Editor({ element: document.createElement('div'),
    content: '<pre><code class="language-unknown">&lt;script&gt;alert(1)&lt;/script&gt;</code></pre>', plugins: [new SyntaxHighlightPlugin()] });
  expect(editor.view.dom.querySelector('script')).toBeNull();
  expect(editor.getText()).toContain('<script>');
});

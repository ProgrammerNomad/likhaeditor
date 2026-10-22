import { afterEach, expect, it, vi } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { CharacterCountPlugin } from '../src/character-count';
let editor: Editor;
afterEach(() => { editor?.destroy(); document.body.replaceChildren(); vi.useRealTimers(); });
it('counts decoded text and separates paragraphs without leaking timers', () => {
  vi.useFakeTimers();
  const counter = document.createElement('div'); counter.id = 'count'; document.body.appendChild(counter);
  editor = new Editor({ element: document.createElement('div'), content: '<p>A &amp; B</p><p>😊</p>', plugins: [new CharacterCountPlugin({ target: '#count' })] });
  expect(editor.executeCommand('getCharacterCount')).toBe(7);
  expect(editor.executeCommand('getWordCount')).toBe(4);
  expect(counter.textContent).toBe('7 characters, 4 words');
  editor.setContent('<p>Updated</p>');
  expect(counter.textContent).toBe('7 characters, 1 words');
  editor.destroy(); expect(vi.getTimerCount()).toBe(0);
});

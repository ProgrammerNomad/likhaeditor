import type { Editor } from '@likhaeditor/core';
import { Plugin } from '@likhaeditor/core';

const COMMON_EMOJI = ['😀', '👍', '🎉', '❤️', '✅', '🔥', '⭐', '📝'];

/** Inserts Unicode emoji at the current selection. */
export class EmojiPlugin extends Plugin {
  name = 'emoji';

  commands() {
    return {
      insertEmoji: (editor: Editor, emoji: string): boolean => {
        if (!emoji.trim()) return false;
        const { tr } = editor.view.state;
        editor.view.dispatch(tr.insertText(emoji));
        return true;
      },
      listEmoji: () => COMMON_EMOJI,
    };
  }
}

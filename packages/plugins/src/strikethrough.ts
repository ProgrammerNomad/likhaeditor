import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';
import { toggleMark } from 'prosemirror-commands';

/**
 * Strikethrough Plugin
 * Adds strikethrough formatting to text (like Medium editor)
 */
export class StrikethroughPlugin extends Plugin {
  name = 'strikethrough';

  commands() {
    return {
      toggleStrikethrough: (editor: Editor) => {
        const { view } = editor;
        const markType = view.state.schema.marks.strikethrough;
        if (!markType) return false;
        
        return toggleMark(markType)(view.state, view.dispatch);
      }
    };
  }

  keymap() {
    return {
      'Mod-Shift-s': (editor: Editor) => {
        return editor.executeCommand('toggleStrikethrough');
      }
    };
  }
}

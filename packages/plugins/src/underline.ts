import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';
import { toggleMark } from 'prosemirror-commands';

/**
 * Underline Plugin
 * Adds underline formatting to text
 */
export class UnderlinePlugin extends Plugin {
  name = 'underline';

  commands() {
    return {
      toggleUnderline: (editor: Editor) => {
        const { view } = editor;
        const markType = view.state.schema.marks.underline;
        if (!markType) return false;
        
        return toggleMark(markType)(view.state, view.dispatch);
      }
    };
  }

  keymap() {
    return {
      'Mod-u': (editor: Editor) => {
        return editor.executeCommand('toggleUnderline');
      }
    };
  }
}

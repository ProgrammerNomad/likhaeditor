import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';
import { toggleMark } from 'prosemirror-commands';

/**
 * Superscript Plugin
 * Adds superscript formatting for mathematical notation (E=mc²)
 */
export class SuperscriptPlugin extends Plugin {
  name = 'superscript';

  commands() {
    return {
      toggleSuperscript: (editor: Editor) => {
        const { view } = editor;
        const schema = view.state.schema;
        const markType = schema.marks.superscript;
        if (!markType) return false;
        
        // Remove subscript if active before applying superscript
        const subscriptType = schema.marks.subscript;
        if (subscriptType && view.state.selection.$from.marks().some(m => m.type === subscriptType)) {
          toggleMark(subscriptType)(view.state, view.dispatch);
        }
        
        return toggleMark(markType)(view.state, view.dispatch);
      }
    };
  }

  keymap() {
    return {
      'Mod-.': (editor: Editor) => {
        return editor.executeCommand('toggleSuperscript');
      }
    };
  }
}

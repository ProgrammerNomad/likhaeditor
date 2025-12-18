import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';
import { toggleMark } from 'prosemirror-commands';

/**
 * Subscript Plugin
 * Adds subscript formatting for scientific notation (H₂O)
 */
export class SubscriptPlugin extends Plugin {
  name = 'subscript';

  commands() {
    return {
      toggleSubscript: (editor: Editor) => {
        const { view } = editor;
        const schema = view.state.schema;
        const markType = schema.marks.subscript;
        if (!markType) return false;
        
        // Remove superscript if active before applying subscript
        const superscriptType = schema.marks.superscript;
        if (superscriptType && view.state.selection.$from.marks().some(m => m.type === superscriptType)) {
          toggleMark(superscriptType)(view.state, view.dispatch);
        }
        
        return toggleMark(markType)(view.state, view.dispatch);
      }
    };
  }

  keymap() {
    return {
      'Mod-,': (editor: Editor) => {
        return editor.executeCommand('toggleSubscript');
      }
    };
  }
}

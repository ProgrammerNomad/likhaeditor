import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';

/**
 * Clear Formatting Plugin
 * Removes all formatting (marks and block types) from selection
 */
export class ClearFormattingPlugin extends Plugin {
  name = 'clearFormatting';

  commands() {
    return {
      clearFormat: (editor: Editor) => {
        const { view } = editor;
        const { state, dispatch } = view;
        const { tr, selection } = state;
        const schema = state.schema;
        
        // Remove all marks from selection
        const { from, to } = selection;
        tr.removeMark(from, to);
        
        // Reset to paragraph if it's a special block type
        if (schema.nodes.paragraph) tr.setBlockType(from, to, schema.nodes.paragraph);
        tr.setStoredMarks([]);
        
        if (dispatch) {
          dispatch(tr);
        }
        return true;
      }
    };
  }

  keymap() {
    return {
      'Mod-\\': (editor: Editor) => {
        return editor.executeCommand('clearFormat') === true;
      }
    };
  }
}

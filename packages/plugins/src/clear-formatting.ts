import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';
import { setBlockType } from 'prosemirror-commands';

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
        const $from = tr.selection.$from;
        const blockType = $from.parent.type;
        
        if (blockType !== schema.nodes.paragraph && blockType !== schema.nodes.doc) {
          setBlockType(schema.nodes.paragraph)(state, dispatch);
          return true;
        }
        
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
        return editor.executeCommand('clearFormat');
      }
    };
  }
}

import { Plugin } from '@likha/core';

/**
 * Horizontal rule plugin
 * Inserts a horizontal rule (hr)
 */
export class HorizontalRulePlugin extends Plugin {
  name = 'horizontalRule';

  commands() {
    return {
      insertHorizontalRule: (editor: any) => {
        const { state, dispatch } = editor.view;
        const hrType = state.schema.nodes.horizontal_rule;
        
        if (!hrType) {
          console.warn('Horizontal rule node type not found in schema');
          return false;
        }

        // Insert the horizontal rule at current selection
        const hr = hrType.create();
        const tr = state.tr.replaceSelectionWith(hr);
        
        if (dispatch) {
          dispatch(tr);
          return true;
        }
        
        return false;
      }
    };
  }

  keymap() {
    return {
      'Mod-_': (editor: any) => this.commands().insertHorizontalRule(editor),
    };
  }
}

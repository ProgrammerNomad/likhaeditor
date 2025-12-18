import { Plugin } from '@likhaeditor/core';
import { wrapIn, lift } from 'prosemirror-commands';

/**
 * Blockquote plugin
 * Provides blockquote formatting
 */
export class BlockquotePlugin extends Plugin {
  name = 'blockquote';

  commands() {
    return {
      toggleBlockquote: (editor: any) => {
        const { state, dispatch } = editor.view;
        const blockquoteType = state.schema.nodes.blockquote;
        
        if (!blockquoteType) {
          console.warn('Blockquote node type not found in schema');
          return false;
        }

        // Check if we're currently in a blockquote
        const { $from } = state.selection;
        
        // Try to find if we're inside a blockquote
        for (let d = $from.depth; d >= 0; d--) {
          const node = $from.node(d);
          if (node.type === blockquoteType) {
            // We're in a blockquote, lift out of it
            return lift(state, dispatch);
          }
        }

        // Not in a blockquote, wrap in one
        return wrapIn(blockquoteType)(state, dispatch);
      },

      isBlockquoteActive: (editor: any): boolean => {
        const { state } = editor.view;
        const { $from } = state.selection;
        const blockquoteType = state.schema.nodes.blockquote;

        if (!blockquoteType) return false;

        // Check if we're inside a blockquote
        for (let d = $from.depth; d >= 0; d--) {
          if ($from.node(d).type === blockquoteType) {
            return true;
          }
        }

        return false;
      }
    };
  }

  keymap() {
    return {
      'Ctrl->': (editor: any) => this.commands().toggleBlockquote(editor),
      'Ctrl-Shift-b': (editor: any) => this.commands().toggleBlockquote(editor),
    };
  }
}

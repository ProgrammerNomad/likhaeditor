import { Plugin } from '@likha/core';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';

/**
 * Bullet list plugin
 * Provides unordered list functionality
 */
export class BulletListPlugin extends Plugin {
  name = 'bulletList';

  commands() {
    return {
      toggleBulletList: (editor: any) => {
        const { state, dispatch } = editor.view;
        const listType = state.schema.nodes.bullet_list;
        const itemType = state.schema.nodes.list_item;

        if (!listType || !itemType) {
          console.warn('List node types not found in schema');
          return false;
        }

        // Check if we're already in a bullet list
        const { $from } = state.selection;
        let depth = $from.depth;
        let inBulletList = false;

        while (depth > 0) {
          const node = $from.node(depth);
          if (node.type === listType) {
            inBulletList = true;
            break;
          }
          depth--;
        }

        if (inBulletList) {
          // Lift out of list
          return liftListItem(itemType)(state, dispatch);
        } else {
          // Wrap in list
          return wrapInList(listType)(state, dispatch);
        }
      },

      isBulletListActive: (editor: any): boolean => {
        const { state } = editor.view;
        const { $from } = state.selection;
        const listType = state.schema.nodes.bullet_list;

        if (!listType) return false;

        let depth = $from.depth;
        while (depth > 0) {
          const node = $from.node(depth);
          if (node.type === listType) {
            return true;
          }
          depth--;
        }

        return false;
      }
    };
  }

  keymap() {
    return {
      'Ctrl-Shift-8': (editor: any) => this.commands().toggleBulletList(editor),
    };
  }
}

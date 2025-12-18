import { Plugin } from '@likhaeditor/core';
import { wrapInList, liftListItem, splitListItem } from 'prosemirror-schema-list';

/**
 * Ordered list plugin
 * Provides numbered list functionality
 */
export class OrderedListPlugin extends Plugin {
  name = 'orderedList';

  commands() {
    return {
      toggleOrderedList: (editor: any) => {
        const { state, dispatch } = editor.view;
        const listType = state.schema.nodes.ordered_list;
        const itemType = state.schema.nodes.list_item;

        if (!listType || !itemType) {
          console.warn('List node types not found in schema');
          return false;
        }

        // Check if we're already in an ordered list
        const { $from } = state.selection;
        let depth = $from.depth;
        let inOrderedList = false;

        while (depth > 0) {
          const node = $from.node(depth);
          if (node.type === listType) {
            inOrderedList = true;
            break;
          }
          depth--;
        }

        if (inOrderedList) {
          // Lift out of list
          return liftListItem(itemType)(state, dispatch);
        } else {
          // Wrap in list
          return wrapInList(listType)(state, dispatch);
        }
      },

      isOrderedListActive: (editor: any): boolean => {
        const { state } = editor.view;
        const { $from } = state.selection;
        const listType = state.schema.nodes.ordered_list;

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
      'Enter': (_editor: any, state: any, dispatch: any) => {
        const itemType = state.schema.nodes.list_item;
        const listType = state.schema.nodes.ordered_list;
        if (!itemType || !listType) return false;
        
        // Only handle Enter if we're in an ordered list
        const { $from } = state.selection;
        let depth = $from.depth;
        let inOrderedList = false;
        while (depth > 0) {
          const node = $from.node(depth);
          if (node.type === listType) {
            inOrderedList = true;
            break;
          }
          depth--;
        }
        
        if (!inOrderedList) return false;
        return splitListItem(itemType)(state, dispatch);
      },
      'Mod-]': (editor: any) => {
        const { state, dispatch } = editor.view;
        const itemType = state.schema.nodes.list_item;
        if (!itemType) return false;
        return liftListItem(itemType)(state, dispatch);
      },
      'Ctrl-Shift-9': (editor: any) => this.commands().toggleOrderedList(editor),
    };
  }
}

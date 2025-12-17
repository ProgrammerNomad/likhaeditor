import { Plugin } from '@likha/core';
import { keymap } from 'prosemirror-keymap';

/**
 * Text alignment plugin
 * Provides text alignment functionality (left, center, right, justify)
 */
export class TextAlignmentPlugin extends Plugin {
  name = 'text-alignment';

  commands() {
    return {
      setTextAlign: (editor: any, alignment: 'left' | 'center' | 'right' | 'justify'): boolean => {
        const { state, dispatch } = editor.view;
        const { from, to } = state.selection;

        if (!dispatch) return false;

        const tr = state.tr;
        
        state.doc.nodesBetween(from, to, (node: any, pos: number) => {
          if (node.isBlock && node.type.name !== 'doc' && node.type.name !== 'list_item') {
            // Preserve all existing attributes and only update textAlign
            const attrs = { ...node.attrs, textAlign: alignment };
            tr.setNodeMarkup(pos, undefined, attrs);
          }
        });

        dispatch(tr);
        return true;
      },

      setAlignLeft: (editor: any): boolean => {
        return this.commands().setTextAlign(editor, 'left');
      },

      setAlignCenter: (editor: any): boolean => {
        return this.commands().setTextAlign(editor, 'center');
      },

      setAlignRight: (editor: any): boolean => {
        return this.commands().setTextAlign(editor, 'right');
      },

      setAlignJustify: (editor: any): boolean => {
        return this.commands().setTextAlign(editor, 'justify');
      },

      getTextAlign: (editor: any): string | null => {
        const { state } = editor.view;
        const { $from } = state.selection;
        
        const node = $from.node($from.depth);
        return node.attrs.textAlign || 'left';
      },

      isAlignActive: (editor: any, alignment: 'left' | 'center' | 'right' | 'justify'): boolean => {
        const currentAlign = this.commands().getTextAlign(editor);
        return currentAlign === alignment;
      }
    };
  }

  prosemirrorPlugins() {
    return [
      keymap({
        'Mod-Shift-l': (state, dispatch) => {
          if (!dispatch) return false;
          const tr = state.tr;
          const { from, to } = state.selection;
          
          state.doc.nodesBetween(from, to, (node: any, pos: number) => {
            if (node.isBlock && node.type.name !== 'doc' && node.type.name !== 'list_item') {
              const attrs = { ...node.attrs, textAlign: 'left' };
              tr.setNodeMarkup(pos, undefined, attrs);
            }
          });

          dispatch(tr);
          return true;
        },
        'Mod-Shift-e': (state, dispatch) => {
          if (!dispatch) return false;
          const tr = state.tr;
          const { from, to } = state.selection;
          
          state.doc.nodesBetween(from, to, (node: any, pos: number) => {
            if (node.isBlock && node.type.name !== 'doc' && node.type.name !== 'list_item') {
              const attrs = { ...node.attrs, textAlign: 'center' };
              tr.setNodeMarkup(pos, undefined, attrs);
            }
          });

          dispatch(tr);
          return true;
        },
        'Mod-Shift-r': (state, dispatch) => {
          if (!dispatch) return false;
          const tr = state.tr;
          const { from, to } = state.selection;
          
          state.doc.nodesBetween(from, to, (node: any, pos: number) => {
            if (node.isBlock && node.type.name !== 'doc' && node.type.name !== 'list_item') {
              const attrs = { ...node.attrs, textAlign: 'right' };
              tr.setNodeMarkup(pos, undefined, attrs);
            }
          });

          dispatch(tr);
          return true;
        },
        'Mod-Shift-j': (state, dispatch) => {
          if (!dispatch) return false;
          const tr = state.tr;
          const { from, to } = state.selection;
          
          state.doc.nodesBetween(from, to, (node: any, pos: number) => {
            if (node.isBlock && node.type.name !== 'doc' && node.type.name !== 'list_item') {
              const attrs = { ...node.attrs, textAlign: 'justify' };
              tr.setNodeMarkup(pos, undefined, attrs);
            }
          });

          dispatch(tr);
          return true;
        }
      })
    ];
  }
}

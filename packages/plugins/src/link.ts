import { Plugin } from '@likhaeditor/core';
import { keymap } from 'prosemirror-keymap';

/**
 * Link plugin
 * Provides hyperlink functionality with URL editing
 */
export class LinkPlugin extends Plugin {
  name = 'link';

  commands() {
    return {
      setLink: (editor: any, href: string): boolean => {
        const { state, dispatch } = editor.view;
        const linkMark = state.schema.marks.link;
        
        if (!linkMark) {
          console.warn('Link mark type not found in schema');
          return false;
        }

        const { from, to } = state.selection;
        
        // If no text selected, cannot create link
        if (from === to) {
          return false;
        }

        // Add link mark to selection
        const tr = state.tr.addMark(from, to, linkMark.create({ href }));
        if (dispatch) {
          dispatch(tr);
          return true;
        }
        
        return false;
      },

      removeLink: (editor: any): boolean => {
        const { state, dispatch } = editor.view;
        const linkMark = state.schema.marks.link;
        
        if (!linkMark) {
          return false;
        }

        const { from, to } = state.selection;
        const tr = state.tr.removeMark(from, to, linkMark);
        
        if (dispatch) {
          dispatch(tr);
          return true;
        }
        
        return false;
      },

      toggleLink: (editor: any, href?: string): boolean => {
        const isActive = this.commands().isLinkActive(editor);
        
        if (isActive) {
          return this.commands().removeLink(editor);
        }
        
        // If href provided, set link
        if (href) {
          return this.commands().setLink(editor, href);
        }
        
        return false;
      },

      isLinkActive: (editor: any): boolean => {
        const { state } = editor.view;
        const linkMark = state.schema.marks.link;
        
        if (!linkMark) return false;

        const { from, to } = state.selection;
        let active = false;

        state.doc.nodesBetween(from, to, (node: any) => {
          if (node.marks.some((m: any) => m.type === linkMark)) {
            active = true;
          }
        });

        return active;
      },

      getLinkHref: (editor: any): string | null => {
        const { state } = editor.view;
        const linkMark = state.schema.marks.link;
        
        if (!linkMark) return null;

        const { from, to } = state.selection;
        let href: string | null = null;

        state.doc.nodesBetween(from, to, (node: any) => {
          const mark = node.marks.find((m: any) => m.type === linkMark);
          if (mark) {
            href = mark.attrs.href;
          }
        });

        return href;
      }
    };
  }

  prosemirrorPlugins() {
    return [
      keymap({
        'Mod-k': (state, dispatch) => {
          const linkMark = state.schema.marks.link;
          
          if (!linkMark) return false;

          const { from, to } = state.selection;
          
          // Need text selection to create link
          if (from === to) return false;

          // Check for existing link
          let existingHref = '';
          state.doc.nodesBetween(from, to, (node: any) => {
            const mark = node.marks.find((m: any) => m.type === linkMark);
            if (mark && !existingHref) {
              existingHref = mark.attrs.href;
            }
          });

          // Prompt for URL (will be enhanced with dialog later)
          const url = prompt('Enter URL:', existingHref || 'https://');
          
          if (!url) return false;

          if (dispatch) {
            const tr = state.tr.addMark(from, to, linkMark.create({ href: url }));
            dispatch(tr);
          }
          
          return true;
        }
      })
    ];
  }
}

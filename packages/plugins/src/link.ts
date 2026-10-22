import type { Editor } from '@likhaeditor/core';
import { Plugin, isSafeURL } from '@likhaeditor/core';
import { Plugin as ProseMirrorPlugin } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';

/**
 * Link plugin
 * Provides hyperlink functionality with URL editing
 */
export class LinkPlugin extends Plugin {
  name = 'link';

  commands() {
    return {
      setLink: (editor: Editor, href: string): boolean => {
        if (!isSafeURL(href)) return false;
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

      removeLink: (editor: Editor): boolean => {
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

      toggleLink: (editor: Editor, href?: string): boolean => {
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

      isLinkActive: (editor: Editor): boolean => {
        const { state } = editor.view;
        const linkMark = state.schema.marks.link;
        
        if (!linkMark) return false;

        const { from, to } = state.selection;
        let active = false;

        state.doc.nodesBetween(from, to, (node) => {
          if (node.marks.some((m) => m.type === linkMark)) {
            active = true;
          }
        });

        return active;
      },

      getLinkHref: (editor: Editor): string | null => {
        const { state } = editor.view;
        const linkMark = state.schema.marks.link;
        
        if (!linkMark) return null;

        const { from, to } = state.selection;
        let href: string | null = null;

        state.doc.nodesBetween(from, to, (node) => {
          const mark = node.marks.find((m) => m.type === linkMark);
          if (mark) {
            href = mark.attrs.href;
          }
        });

        return href;
      }
    };
  }

  prosemirrorPlugins(): ProseMirrorPlugin[] {
    return [
      keymap({
        'Mod-k': (state, dispatch) => {
          const linkMark = state.schema.marks.link;
          
          if (!linkMark) return false;

          const { from, to } = state.selection;
          
          // Need text selection to create link
          if (from === to) return false;

          if (!dispatch) return true;
          this.editor?.view.dom.dispatchEvent(new CustomEvent('likha:request-link', { bubbles: true }));
          return !!this.editor;

        }
      })
    ];
  }
}

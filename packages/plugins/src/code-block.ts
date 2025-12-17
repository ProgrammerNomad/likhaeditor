import { Plugin } from '@likha/core';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';

/**
 * Code block plugin
 * Provides code block functionality with language support
 */
export class CodeBlockPlugin extends Plugin {
  name = 'code-block';

  commands() {
    return {
      setCodeBlock: (editor: any, language?: string): boolean => {
        const { state, dispatch } = editor.view;
        const codeBlockType = state.schema.nodes.code_block;
        
        if (!codeBlockType) {
          console.warn('Code block node type not found in schema');
          return false;
        }

        const attrs = language ? { language } : {};
        return setBlockType(codeBlockType, attrs)(state, dispatch);
      },

      toggleCodeBlock: (editor: any, language?: string): boolean => {
        const isActive = this.commands().isCodeBlockActive(editor);
        
        if (isActive) {
          // Convert to paragraph
          const { state, dispatch } = editor.view;
          const paragraphType = state.schema.nodes.paragraph;
          return setBlockType(paragraphType)(state, dispatch);
        }
        
        return this.commands().setCodeBlock(editor, language);
      },

      isCodeBlockActive: (editor: any): boolean => {
        const { state } = editor.view;
        const codeBlockType = state.schema.nodes.code_block;
        
        if (!codeBlockType) return false;

        const { $from, to } = state.selection;
        let isActive = false;

        state.doc.nodesBetween($from.pos, to, (node: any) => {
          if (node.type === codeBlockType) {
            isActive = true;
          }
        });

        return isActive;
      },

      getCodeBlockLanguage: (editor: any): string | null => {
        const { state } = editor.view;
        const codeBlockType = state.schema.nodes.code_block;
        
        if (!codeBlockType) return null;

        const { $from } = state.selection;
        const node = $from.node($from.depth);

        if (node.type === codeBlockType) {
          return node.attrs.language || null;
        }

        return null;
      }
    };
  }

  prosemirrorPlugins() {
    return [
      keymap({
        'Mod-Alt-c': (state, dispatch) => {
          const codeBlockType = state.schema.nodes.code_block;
          if (!codeBlockType) return false;
          return setBlockType(codeBlockType)(state, dispatch);
        },
        'Shift-Ctrl-\\': (state, dispatch) => {
          const codeBlockType = state.schema.nodes.code_block;
          if (!codeBlockType) return false;
          return setBlockType(codeBlockType)(state, dispatch);
        }
      })
    ];
  }
}

import { Plugin } from '@likha/core';
import { setBlockType } from 'prosemirror-commands';

/**
 * Heading plugin
 * Provides heading levels (H1, H2, H3, H4, H5, H6)
 */
export class HeadingPlugin extends Plugin {
  name = 'heading';

  commands() {
    return {
      setHeading: (editor: any, level: 1 | 2 | 3 | 4 | 5 | 6) => {
        const { state, dispatch } = editor.view;
        const headingType = state.schema.nodes.heading;
        
        if (!headingType) {
          console.warn('Heading node type not found in schema');
          return false;
        }

        return setBlockType(headingType, { level })(state, dispatch);
      },

      setParagraph: (editor: any) => {
        const { state, dispatch } = editor.view;
        const paragraphType = state.schema.nodes.paragraph;
        
        if (!paragraphType) {
          console.warn('Paragraph node type not found in schema');
          return false;
        }

        return setBlockType(paragraphType)(state, dispatch);
      },

      toggleHeading: (editor: any, level: 1 | 2 | 3 | 4 | 5 | 6) => {
        const { state } = editor.view;
        const { $from } = state.selection;
        const node = $from.node($from.depth);

        // If already at this heading level, convert to paragraph
        if (node.type.name === 'heading' && node.attrs.level === level) {
          return this.commands().setParagraph(editor);
        }

        // Otherwise, set to heading
        return this.commands().setHeading(editor, level);
      },

      isHeadingActive: (editor: any, level: 1 | 2 | 3 | 4 | 5 | 6): boolean => {
        const { state } = editor.view;
        const { $from } = state.selection;
        const node = $from.node($from.depth);

        return node.type.name === 'heading' && node.attrs.level === level;
      }
    };
  }

  keymap() {
    return {
      'Ctrl-Alt-1': (editor: any) => this.commands().toggleHeading(editor, 1),
      'Ctrl-Alt-2': (editor: any) => this.commands().toggleHeading(editor, 2),
      'Ctrl-Alt-3': (editor: any) => this.commands().toggleHeading(editor, 3),
      'Ctrl-Alt-4': (editor: any) => this.commands().toggleHeading(editor, 4),
      'Ctrl-Alt-5': (editor: any) => this.commands().toggleHeading(editor, 5),
      'Ctrl-Alt-6': (editor: any) => this.commands().toggleHeading(editor, 6),
    };
  }
}

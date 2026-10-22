import type { Editor } from '@likhaeditor/core';
import { Plugin } from '@likhaeditor/core';
import { Plugin as StatePlugin } from 'prosemirror-state';

export interface SlashCommand {
  label: string;
  keywords?: string[];
  run: (editor: Editor) => boolean;
}

export interface SlashCommandsOptions {
  commands?: SlashCommand[];
  onOpen?: (commands: SlashCommand[]) => void;
}

function defaultCommands(_editor: Editor): SlashCommand[] {
  return [
    { label: 'Heading 1', run: (e) => Boolean(e.executeCommand('setHeading', 1)) },
    { label: 'Bullet list', run: (e) => Boolean(e.executeCommand('toggleBulletList')) },
    { label: 'Quote', run: (e) => Boolean(e.executeCommand('toggleBlockquote')) },
    { label: 'Code block', run: (e) => Boolean(e.executeCommand('toggleCodeBlock')) },
    { label: 'Horizontal rule', keywords: ['divider'], run: (e) => Boolean(e.executeCommand('insertHorizontalRule')) },
  ];
}

/** Opens the host-provided command palette when `/` is typed at a block start. */
export class SlashCommandsPlugin extends Plugin {
  name = 'slashCommands';

  constructor(private options: SlashCommandsOptions = {}) {
    super();
  }

  prosemirrorPlugins(): StatePlugin[] {
    return [new StatePlugin({
      props: {
        handleKeyDown: (_view, event) => {
          if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return false;
          const editor = this.editor;
          if (!editor) return false;
          const { $from } = editor.view.state.selection;
          if (!$from.parent.isTextblock || $from.parentOffset !== 0) return false;
          const commands = this.options.commands ?? defaultCommands(editor);
          this.options.onOpen?.(commands);
          event.preventDefault();
          return true;
        },
      },
    })];
  }
}

import type { Editor } from '@likhaeditor/core';
import { Plugin } from '@likhaeditor/core';

export interface MentionOption {
  id: string;
  label: string;
}

export interface MentionsOptions {
  resolveSuggestions?: (query: string) => MentionOption[] | Promise<MentionOption[]>;
}

/** Applies mention marks and optional @-triggered suggestions. */
export class MentionsPlugin extends Plugin {
  name = 'mentions';

  constructor(private options: MentionsOptions = {}) {
    super();
  }

  commands() {
    return {
      insertMention: (editor: Editor, id: string, label?: string): boolean => {
        const mark = editor.view.state.schema.marks.mention;
        if (!mark || !id.trim()) return false;
        const { from, to, empty } = editor.view.state.selection;
        if (empty) return false;
        const text = editor.view.state.doc.textBetween(from, to);
        const tr = editor.view.state.tr;
        tr.removeMark(from, to, mark);
        const resolved = label ?? (text.replace(/^@/, '') || id);
        tr.addMark(from, to, mark.create({ id, label: resolved }));
        editor.view.dispatch(tr);
        return true;
      },
      mentionSuggestions: async (editor: Editor, query: string) => {
        void editor;
        return this.options.resolveSuggestions?.(query) ?? [];
      },
    };
  }
}

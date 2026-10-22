import { Plugin, type Editor } from '@likhaeditor/core';
import { TextSelection } from 'prosemirror-state';

export interface SearchMatch { from: number; to: number; }
export class FindReplacePlugin extends Plugin {
  name = 'findReplace';

  find(editor: Editor, query: string, caseSensitive = false): SearchMatch[] {
    if (!query) return [];
    const matches: SearchMatch[] = [];
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const expression = new RegExp(escaped, caseSensitive ? 'gu' : 'giu');
    editor.view.state.doc.descendants((node, pos) => {
      if (!node.isTextblock) return;
      const text = node.textBetween(0, node.content.size, '', '\ufffc');
      expression.lastIndex = 0;
      for (const match of text.matchAll(expression)) {
        matches.push({ from: pos + 1 + match.index!, to: pos + 1 + match.index! + match[0].length });
      }
      return false;
    });
    return matches;
  }

  findNext(editor: Editor, query: string, caseSensitive = false): boolean {
    const matches = this.find(editor, query, caseSensitive);
    const match = matches.find(match => match.from >= editor.view.state.selection.to) || matches[0];
    if (!match) return false;
    editor.view.dispatch(editor.view.state.tr.setSelection(TextSelection.create(editor.view.state.doc, match.from, match.to)).scrollIntoView());
    return true;
  }

  replaceAll(editor: Editor, query: string, replacement: string, caseSensitive = false): number {
    const matches = this.find(editor, query, caseSensitive);
    if (!matches.length) return 0;
    const tr = editor.view.state.tr;
    for (const match of [...matches].reverse()) tr.insertText(replacement, match.from, match.to);
    editor.view.dispatch(tr);
    return matches.length;
  }

  commands() {
    return { find: this.find.bind(this), findNext: this.findNext.bind(this), replaceAll: this.replaceAll.bind(this) };
  }
}

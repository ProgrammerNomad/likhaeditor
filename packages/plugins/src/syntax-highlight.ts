import { Plugin } from '@likhaeditor/core';
import { Plugin as StatePlugin } from 'prosemirror-state';
import type { Node } from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { common, createLowlight } from 'lowlight';

const highlighter = createLowlight(common);
type Token = ReturnType<typeof highlighter.highlight>['children'][number];

/** Highlight decorations never change document content or inject generated HTML. */
export class SyntaxHighlightPlugin extends Plugin {
  name = 'syntaxHighlight';
  private cache = new WeakMap<Node, Array<{ from: number; to: number; classes: string }>>();
  languages(): string[] { return highlighter.listLanguages(); }
  private decorations(doc: Node): DecorationSet {
    const decorations: Decoration[] = [];
    doc.descendants((node, pos) => {
      if (node.type.name !== 'code_block') return;
      const language = node.attrs.language;
      // Keep very large blocks responsive and unknown languages editable as plain text.
      if (!language || !highlighter.registered(language) || node.textContent.length > 100000) return false;
      let ranges = this.cache.get(node);
      if (!ranges) {
        ranges = [];
        let offset = 0;
        const visit = (tokens: Token[], classes: string[] = []) => {
          for (const token of tokens) {
            if (token.type === 'text') {
              const end = offset + token.value.length;
              if (end > offset && classes.length) ranges?.push({ from: offset, to: end, classes: classes.join(' ') });
              offset = end;
            } else if (token.type === 'element') {
              const names = token.properties.className;
              visit(token.children, [...classes, ...(Array.isArray(names) ? names.map(String) : [])]);
            }
          }
        };
        visit(highlighter.highlight(language, node.textContent).children);
        this.cache.set(node, ranges);
      }
      for (const range of ranges) decorations.push(Decoration.inline(pos + 1 + range.from, pos + 1 + range.to, { class: range.classes }));
      return false;
    });
    return DecorationSet.create(doc, decorations);
  }
  prosemirrorPlugins() {
    return [new StatePlugin<DecorationSet>({
      state: { init: (_config, state) => this.decorations(state.doc),
        apply: (tr, previous) => tr.docChanged ? this.decorations(tr.doc) : previous },
      props: { decorations(state) { return this.getState(state); } },
    })];
  }
}

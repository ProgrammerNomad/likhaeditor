import { Plugin, type Editor } from '@likhaeditor/core';
import { MarkdownParser, MarkdownSerializer, defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';

/** CommonMark subset: unsupported rich nodes/marks fail export rather than losing data. */
export class MarkdownPlugin extends Plugin {
  name = 'markdown';
  importMarkdown(editor: Editor, markdown: string): boolean {
    const parser = new MarkdownParser(editor.view.state.schema, defaultMarkdownParser.tokenizer, {
      ...defaultMarkdownParser.tokens,
      fence: { block: 'code_block', getAttrs: token => ({ language: token.info || '' }), noCloseToken: true },
    });
    editor.setJSON(parser.parse(markdown).toJSON());
    return true;
  }
  exportMarkdown(editor: Editor): string {
    const serializer = new MarkdownSerializer({
      ...defaultMarkdownSerializer.nodes,
      code_block: (state, node) => {
        const runs = node.textContent.match(/`{3,}/g) || [];
        const fence = '`'.repeat(Math.max(3, ...runs.map(run => run.length + 1)));
        state.write(fence + (node.attrs.language || '') + '\n');
        state.text(node.textContent, false);
        state.ensureNewLine(); state.write(fence); state.closeBlock(node);
      },
    }, defaultMarkdownSerializer.marks, { strict: true });
    return serializer.serialize(editor.view.state.doc);
  }
  commands() {
    return { importMarkdown: this.importMarkdown.bind(this), exportMarkdown: this.exportMarkdown.bind(this) };
  }
}

import type { Editor } from '@likhaeditor/core';
import { Plugin, toEmbedURL } from '@likhaeditor/core';

/** Inserts validated video embed blocks (YouTube/Vimeo). */
export class EmbedPlugin extends Plugin {
  name = 'embed';

  commands() {
    return {
      insertEmbed: (editor: Editor, url: string): boolean => {
        const src = toEmbedURL(url);
        if (!src) return false;
        const type = editor.view.state.schema.nodes.embed;
        if (!type) return false;
        const node = type.create({ src, provider: 'video' });
        const tr = editor.view.state.tr.replaceSelectionWith(node).scrollIntoView();
        editor.view.dispatch(tr);
        return true;
      },
    };
  }
}

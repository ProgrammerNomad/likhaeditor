import { Plugin } from '@likhaeditor/core';
import { Plugin as StatePlugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

/** Per-editor placeholder, without interpolated CSS or global style side effects. */
export class PlaceholderPlugin extends Plugin {
  name = 'placeholder';
  private text: string;
  constructor(config: { text?: string } = {}) {
    super(config);
    this.text = config.text ?? 'Start typing...';
  }
  prosemirrorPlugins(): StatePlugin[] {
    return [new StatePlugin({ props: {
      decorations: state => {
        const first = state.doc.firstChild;
        if (state.doc.childCount !== 1 || !first?.isTextblock || first.content.size) return null;
        return DecorationSet.create(state.doc, [Decoration.node(0, first.nodeSize, {
          class: 'is-empty', 'data-placeholder': this.text,
        })]);
      },
    } })];
  }
}

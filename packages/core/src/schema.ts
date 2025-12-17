import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

/**
 * Extended schema with headings, lists, blockquote, HR, and links
 */
export const likhaSchema: Schema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block')
    .update('heading', {
      attrs: { level: { default: 1 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } },
      ],
      toDOM: (node) => ['h' + node.attrs.level, 0],
    }),
  marks: basicSchema.spec.marks.update('link', {
    attrs: {
      href: {},
      title: { default: null }
    },
    inclusive: false,
    parseDOM: [{
      tag: 'a[href]',
      getAttrs: (dom: any) => ({
        href: dom.getAttribute('href'),
        title: dom.getAttribute('title')
      })
    }],
    toDOM: (node) => ['a', {
      href: node.attrs.href,
      title: node.attrs.title
    }, 0]
  }),
});

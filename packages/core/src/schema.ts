import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

/**
 * Extended schema with headings, lists, blockquote, HR, links, code blocks, and text alignment
 */
export const likhaSchema: Schema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block')
    .update('paragraph', {
      attrs: { textAlign: { default: 'left' } },
      content: 'inline*',
      group: 'block',
      parseDOM: [{
        tag: 'p',
        getAttrs: (dom: any) => ({
          textAlign: dom.style.textAlign || 'left'
        })
      }],
      toDOM: (node) => {
        const align = node.attrs.textAlign;
        const style = align && align !== 'left' ? `text-align: ${align}` : '';
        return ['p', style ? { style } : {}, 0];
      }
    })
    .update('heading', {
      attrs: { 
        level: { default: 1 },
        textAlign: { default: 'left' }
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { 
          tag: 'h1', 
          attrs: { level: 1 },
          getAttrs: (dom: any) => ({
            level: 1,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h2', 
          attrs: { level: 2 },
          getAttrs: (dom: any) => ({
            level: 2,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h3', 
          attrs: { level: 3 },
          getAttrs: (dom: any) => ({
            level: 3,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h4', 
          attrs: { level: 4 },
          getAttrs: (dom: any) => ({
            level: 4,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h5', 
          attrs: { level: 5 },
          getAttrs: (dom: any) => ({
            level: 5,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h6', 
          attrs: { level: 6 },
          getAttrs: (dom: any) => ({
            level: 6,
            textAlign: dom.style.textAlign || 'left'
          })
        },
      ],
      toDOM: (node) => {
        const align = node.attrs.textAlign;
        const style = align && align !== 'left' ? `text-align: ${align}` : '';
        return ['h' + node.attrs.level, style ? { style } : {}, 0];
      }
    })
    .update('code_block', {
      attrs: { language: { default: '' } },
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      parseDOM: [{
        tag: 'pre',
        preserveWhitespace: 'full' as const,
        getAttrs: (dom: any) => {
          const code = dom.querySelector('code');
          const className = code?.getAttribute('class') || '';
          const match = /language-(\w+)/.exec(className);
          return { language: match ? match[1] : '' };
        }
      }],
      toDOM: (node) => {
        const className = node.attrs.language 
          ? `language-${node.attrs.language}` 
          : '';
        return ['pre', ['code', { class: className }, 0]];
      }
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

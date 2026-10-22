import { tableNodes } from 'prosemirror-tables';
import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { isSafeURL } from './url';
import { fontFamily, fontSize } from './typography';

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
        getAttrs: (dom: HTMLElement) => ({
          textAlign: dom.style.textAlign || 'left'
        })
      }],
      toDOM: (node) => {
        const align = node.attrs.textAlign;
        const style = align && align !== 'left' ? `text-align: ${align}` : '';
        return ['p', style ? { style } : {}, 0];
      }
    })
    .update('blockquote', {
      attrs: { textAlign: { default: 'left' } },
      content: 'block+',
      group: 'block',
      defining: true,
      parseDOM: [{
        tag: 'blockquote',
        getAttrs: (dom: HTMLElement) => ({
          textAlign: dom.style.textAlign || 'left'
        })
      }],
      toDOM: (node) => {
        const align = node.attrs.textAlign;
        const style = align && align !== 'left' ? `text-align: ${align}` : '';
        return ['blockquote', style ? { style } : {}, 0];
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
          getAttrs: (dom: HTMLElement) => ({
            level: 1,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h2', 
          attrs: { level: 2 },
          getAttrs: (dom: HTMLElement) => ({
            level: 2,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h3', 
          attrs: { level: 3 },
          getAttrs: (dom: HTMLElement) => ({
            level: 3,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h4', 
          attrs: { level: 4 },
          getAttrs: (dom: HTMLElement) => ({
            level: 4,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h5', 
          attrs: { level: 5 },
          getAttrs: (dom: HTMLElement) => ({
            level: 5,
            textAlign: dom.style.textAlign || 'left'
          })
        },
        { 
          tag: 'h6', 
          attrs: { level: 6 },
          getAttrs: (dom: HTMLElement) => ({
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
        getAttrs: (dom: HTMLElement) => {
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
    })
    .append(tableNodes({ tableGroup: 'block', cellContent: 'block+', cellAttributes: {} }))
    .addToEnd('image', {
      inline: true,
      attrs: {
        src: { default: null },
        alt: { default: null },
        title: { default: null },
        width: { default: null },
        height: { default: null }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [{
        tag: 'img[src]',
        getAttrs: (dom: HTMLElement) => isSafeURL(dom.getAttribute('src'), true) ? ({
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt'),
          title: dom.getAttribute('title'),
          width: dom.getAttribute('width') ? parseInt(dom.getAttribute('width')!, 10) : null,
          height: dom.getAttribute('height') ? parseInt(dom.getAttribute('height')!, 10) : null
        }) : false
      }],
      toDOM: (node) => {
        const attrs: Record<string, string | number | null> = { src: isSafeURL(node.attrs.src, true) ? node.attrs.src : null };
        if (node.attrs.alt) attrs.alt = node.attrs.alt;
        if (node.attrs.title) attrs.title = node.attrs.title;
        if (node.attrs.width) attrs.width = node.attrs.width;
        if (node.attrs.height) attrs.height = node.attrs.height;
        return ['img', attrs];
      }
    }),
  marks: basicSchema.spec.marks
    .addToEnd('fontFamily', {
      attrs: { family: { default: 'Arial', validate: value => { if (!fontFamily(value)) throw new Error('Unsupported font family'); } } },
      parseDOM: [{ style: 'font-family', getAttrs: value => fontFamily(value) ? { family: fontFamily(value) } : false }],
      toDOM: mark => ['span', { style: `font-family: ${fontFamily(mark.attrs.family) ?? 'Arial'}` }, 0],
    })
    .addToEnd('fontSize', {
      attrs: { size: { default: 12, validate: value => { if (!fontSize(value)) throw new Error('Unsupported font size'); } } },
      parseDOM: [{ style: 'font-size', getAttrs: value => {
        const match = /^(\d+)(pt|px)$/.exec(String(value));
        const size = match ? Math.round(Number(match[1]) * (match[2] === 'px' ? 0.75 : 1)) : null;
        return fontSize(size) ? { size } : false;
      } }],
      toDOM: mark => ['span', { style: `font-size: ${fontSize(mark.attrs.size) ?? 12}pt` }, 0],
    })
    .update('link', {
      attrs: {
        href: {},
        title: { default: null }
      },
      inclusive: false,
      parseDOM: [{
        tag: 'a[href]',
        getAttrs: (dom: HTMLElement) => isSafeURL(dom.getAttribute('href')) ? ({
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title')
        }) : false
      }],
      toDOM: (node) => ['a', {
        href: isSafeURL(node.attrs.href) ? node.attrs.href : null,
        title: node.attrs.title
      }, 0]
    })
    .addToEnd('textColor', {
      attrs: {
        color: { default: null }
      },
      parseDOM: [{
        tag: 'span[style*="color"]',
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const color = element.style.color;
          return color ? { color } : false;
        }
      }],
      toDOM(node) {
        const { color } = node.attrs;
        return ['span', { style: `color: ${color}` }, 0];
      }
    })
    .addToEnd('highlight', {
      attrs: {
        color: { default: null }
      },
      parseDOM: [{
        tag: 'mark',
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const color = element.style.backgroundColor;
          return color ? { color } : { color: 'yellow' };
        }
      }, {
        tag: 'span[style*="background-color"]',
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const color = element.style.backgroundColor;
          return color ? { color } : false;
        }
      }],
      toDOM(node) {
        const { color } = node.attrs;
        return ['mark', { style: `background-color: ${color}` }, 0];
      }
    })
    .addToEnd('underline', {
      parseDOM: [
        { tag: 'u' },
        { 
          style: 'text-decoration',
          getAttrs: (value: string) => value === 'underline' && null
        }
      ],
      toDOM: () => ['u', 0]
    })
    .addToEnd('strikethrough', {
      parseDOM: [
        { tag: 's' },
        { tag: 'del' },
        { tag: 'strike' },
        { 
          style: 'text-decoration',
          getAttrs: (value: string) => value === 'line-through' && null
        }
      ],
      toDOM: () => ['s', 0]
    })
    .addToEnd('subscript', {
      excludes: 'superscript',
      parseDOM: [{ tag: 'sub' }],
      toDOM: () => ['sub', 0]
    })
    .addToEnd('superscript', {
      excludes: 'subscript',
      parseDOM: [{ tag: 'sup' }],
      toDOM: () => ['sup', 0]
    }),
});

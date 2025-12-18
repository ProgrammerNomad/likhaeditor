import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';
import type { Node as ProseMirrorNode } from 'prosemirror-model';

export class ImagePlugin extends Plugin {
  name = 'image';

  insertImage(editor: Editor, src: string, alt?: string, title?: string): boolean {
    if (!src) return false;
    const { view } = editor;
    const { schema, tr } = view.state;
    const imageNode = schema.nodes.image;
    if (!imageNode) return false;
    const attrs: any = { src };
    if (alt) attrs.alt = alt;
    if (title) attrs.title = title;
    const node = imageNode.create(attrs);
    view.dispatch(tr.replaceSelectionWith(node));
    return true;
  }

  setImageSize(editor: Editor, width?: number, height?: number): boolean {
    const { view } = editor;
    const { selection, tr } = view.state;
    const { $from } = selection;
    let imagePos = -1;
    let imageNode: ProseMirrorNode | null = null;

    if ('node' in selection && (selection as any).node?.type.name === 'image') {
      imagePos = selection.from;
      imageNode = (selection as any).node;
    } else {
      const before = $from.nodeBefore;
      if (before?.type.name === 'image') {
        imagePos = $from.pos - before.nodeSize;
        imageNode = before;
      }
    }

    if (!imageNode || imagePos === -1) return false;
    const attrs = { ...imageNode.attrs };
    if (width !== undefined) attrs.width = width;
    if (height !== undefined) attrs.height = height;
    const newNode = imageNode.type.create(attrs);
    view.dispatch(tr.replaceWith(imagePos, imagePos + imageNode.nodeSize, newNode));
    return true;
  }

  getImageSrc(editor: Editor): string | null {
    const { selection } = editor.view.state;
    if ('node' in selection && (selection as any).node?.type.name === 'image') {
      return (selection as any).node.attrs.src || null;
    }
    const before = selection.$from.nodeBefore;
    return (before?.type.name === 'image') ? before.attrs.src || null : null;
  }

  isImageSelected(editor: Editor): boolean {
    const { selection } = editor.view.state;
    if ('node' in selection && (selection as any).node?.type.name === 'image') return true;
    const before = selection.$from.nodeBefore;
    return before?.type.name === 'image';
  }

  setImageAlt(editor: Editor, alt: string): boolean {
    const { view } = editor;
    const { selection, tr } = view.state;
    let imagePos = -1;
    let imageNode: ProseMirrorNode | null = null;

    if ('node' in selection && (selection as any).node?.type.name === 'image') {
      imagePos = selection.from;
      imageNode = (selection as any).node;
    } else {
      const before = selection.$from.nodeBefore;
      if (before?.type.name === 'image') {
        imagePos = selection.$from.pos - before.nodeSize;
        imageNode = before;
      }
    }

    if (!imageNode || imagePos === -1) return false;
    const attrs = { ...imageNode.attrs, alt };
    const newNode = imageNode.type.create(attrs);
    view.dispatch(tr.replaceWith(imagePos, imagePos + imageNode.nodeSize, newNode));
    return true;
  }

  commands() {
    return {
      insertImage: this.insertImage.bind(this),
      setImageSize: this.setImageSize.bind(this),
      getImageSrc: this.getImageSrc.bind(this),
      isImageSelected: this.isImageSelected.bind(this),
      setImageAlt: this.setImageAlt.bind(this),
    };
  }
}

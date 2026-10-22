import { Plugin, isSafeURL, type Editor } from '@likhaeditor/core';
import { Plugin as StatePlugin, PluginKey } from 'prosemirror-state';

export interface ImageUploadOptions {
  upload: (file: File, signal: AbortSignal) => Promise<{ src: string; alt?: string; title?: string }>;
  maxBytes?: number;
  onError?: (error: unknown) => void;
}

/** Uploads use an application-owned adapter. Positions follow concurrent local edits. */
export class ImageUploadPlugin extends Plugin {
  name = 'imageUpload';
  private key = new PluginKey<Map<number, number>>('imageUploads');
  private nextId = 0;
  private controllers = new Set<AbortController>();
  private disposed = false;
  constructor(private options: ImageUploadOptions) { super(); }

  async uploadImage(editor: Editor, file: File, position = editor.view.state.selection.from): Promise<boolean> {
    if (this.disposed || !editor.view.editable) return false;
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif'].includes(file.type)) throw new Error('Unsupported image type');
    if (file.size > (this.options.maxBytes ?? 10 * 1024 * 1024)) throw new Error('Image exceeds upload size limit');
    const id = ++this.nextId;
    const controller = new AbortController();
    this.controllers.add(controller);
    editor.view.dispatch(editor.view.state.tr.setMeta(this.key, { add: { id, position } }));
    try {
      const image = await this.options.upload(file, controller.signal);
      if (this.disposed || controller.signal.aborted || !editor.view.editable) return false;
      if (!isSafeURL(image.src, true)) throw new Error('Upload returned an unsupported image URL');
      const pos = this.key.getState(editor.view.state)?.get(id);
      if (pos === undefined) return false;
      const node = editor.view.state.schema.nodes.image.create(image);
      editor.view.dispatch(editor.view.state.tr.insert(pos, node).setMeta(this.key, { remove: id }));
      return true;
    } finally {
      this.controllers.delete(controller);
      if (!this.disposed && !editor.view.isDestroyed) editor.view.dispatch(editor.view.state.tr.setMeta(this.key, { remove: id }));
    }
  }

  prosemirrorPlugins() {
    const uploadFiles = (files: File[], position?: number) => {
      if (!this.editor?.view.editable || !files.length) return false;
      // Consume the event synchronously, then upload in file order.
      void (async () => {
        for (const file of files) {
          if (this.disposed || !this.editor) break;
          try { await this.uploadImage(this.editor, file, position); }
          catch (error) { if (!this.disposed) this.options.onError?.(error); }
          position = undefined;
        }
      })();
      return true;
    };
    return [new StatePlugin<Map<number, number>>({
      key: this.key,
      state: {
        init: () => new Map(),
        apply: (tr, previous) => {
          const mapped = new Map<number, number>();
          previous.forEach((pos, id) => {
            const result = tr.mapping.mapResult(pos, 1);
            if (!result.deleted) mapped.set(id, result.pos);
          });
          const meta = tr.getMeta(this.key) as { add?: { id: number; position: number }; remove?: number } | undefined;
          if (meta?.add) mapped.set(meta.add.id, meta.add.position);
          if (meta?.remove !== undefined) mapped.delete(meta.remove);
          return mapped;
        },
      },
      props: {
        handlePaste: (_view, event) => uploadFiles(Array.from(event.clipboardData?.files ?? [])),
        handleDrop: (view, event, _slice, moved) => {
          if (moved) return false;
          const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
          return uploadFiles(Array.from(event.dataTransfer?.files ?? []), position);
        },
      },
    })];
  }

  commands() { return { uploadImage: this.uploadImage.bind(this) }; }
  destroy(): void {
    this.disposed = true;
    this.controllers.forEach(controller => controller.abort());
    this.controllers.clear();
    this.editor = undefined;
  }
}

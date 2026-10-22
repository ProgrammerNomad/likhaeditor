# Professional editing

These APIs describe the current development build. Check [release status](/status) before using a published npm version.

## Tables and search

```js
const instance = createEditor({ element: '#editor' });
instance.editor.executeCommand('insertTable', 3, 3);
// Place the cursor in a table before applying these commands:
instance.editor.executeCommand('addRowAfter');
instance.editor.executeCommand('toggleHeaderRow');
// Merge requires a rectangular cell selection; split requires a merged cell.
instance.editor.executeCommand('mergeCells');
instance.editor.executeCommand('splitCell');

instance.editor.executeCommand('findNext', 'search phrase');
instance.editor.executeCommand('replaceAll', 'old phrase', 'new phrase');
```

Search is literal and case-insensitive by default. Pass `true` as the final argument for case-sensitive matching. Matches can cross inline formatting but do not cross paragraph boundaries. Replace-all is one undoable transaction.

## JSON and Markdown

```js
const json = instance.getJSON();
instance.setJSON(json);
instance.importMarkdown('# A heading\n\n**Bold** text');
const markdown = instance.exportMarkdown();
```

JSON import validates against the editor schema and rejects unsupported link/image URLs. Markdown supports the CommonMark subset: paragraphs, headings, lists, quotes, code, images, links, and basic emphasis. Export throws for unsupported nodes or marks, such as tables and underline. Use HTML or JSON when preserving all rich content is required. Alignment and image dimensions are not represented by CommonMark.

## Autosave on your own backend

```js
const instance = createEditor({
  element: '#editor',
  autosave: {
    delay: 700,
    async save(html, signal) {
      const response = await fetch('/api/documents/123', {
        method: 'PUT', signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html })
      });
      if (!response.ok) throw new Error('Save failed');
    },
    onError: error => console.error(error)
  }
});
// Await before a deliberate navigation or unmount to persist pending edits.
await instance.flushAutosave();
instance.destroy();
```

Writes are serialized and pending edits coalesce. Failed content is retained for the next change or explicit flush. `destroy()` cancels queued work and aborts active requests; it does not guarantee a final save. Add authentication, authorization, CSRF protection, conflict handling, and validation in your own backend.

## Image uploads

```js
const instance = createEditor({
  element: '#editor',
  imageUpload: {
    maxBytes: 5 * 1024 * 1024,
    async upload(file, signal) {
      const body = new FormData();
      body.append('image', file);
      const response = await fetch('/api/images', { method: 'POST', body, signal });
      if (!response.ok) throw new Error('Upload failed');
      return response.json(); // { src: '/uploads/image.png', alt: 'Description' }
    },
    onError: error => console.error(error)
  }
});
// Also available programmatically:
await instance.uploadImage(file);
```

The upload button appears only when an adapter is configured. PNG, JPEG, GIF, WebP, and AVIF MIME types are accepted; default size limit is 10 MiB. Server-side file inspection and access control remain your responsibility. File picker and programmatic errors are surfaced directly; paste/drop failures call `onError`. Pending insertion positions follow edits, and destroying the editor aborts uploads. There is no built-in media hosting service.

## Comments

```js
const instance = createEditor({
  element: '#editor',
  comments: {
    author: 'Reviewer',
    comments: savedComments,
    onChange: comments => saveCommentMetadata(comments)
  }
});
// Select text first:
const id = instance.editor.executeCommand('addComment', 'Please clarify this.');
instance.editor.executeCommand('resolveComment', id);
const comments = instance.editor.executeCommand('listComments');
```

Comments are plain-text metadata, with positions, author, timestamp, and resolution state. Exported article HTML does not contain comments. Save comment metadata with the exact document revision it belongs to; stale positions cannot be safely reapplied to an unrelated revision. Deleted anchors remain as orphaned comments. Comment operations are separate from document undo history and are not a collaboration protocol.

## Version checkpoints

```js
import { createEditor, localVersionStore } from '@likhaeditor/likhaeditor';

const instance = createEditor({
  element: '#editor',
  versions: localVersionStore('my-app:document-123:versions')
});
const version = await instance.versions.save('Before review');
await instance.versions.restore(version.id);
const versions = await instance.versions.list();
await instance.versions.remove(version.id);
```

The CDN exposes `LikhaEditor.localVersionStore`. A custom store implements asynchronous `list`, `save`, and `remove` methods. Local storage is specific to the browser and origin, subject to quota, and not designed for simultaneous multi-tab writes. Snapshots are explicit and contain document JSON only; provide your own retention and synchronization policies.

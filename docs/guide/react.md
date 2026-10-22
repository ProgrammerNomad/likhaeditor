# React integration

## Package (recommended)

```bash
pnpm add @likhaeditor/likhaeditor @likhaeditor/likhaeditor-react
```

```tsx
'use client';
import { LikhaEditor } from '@likhaeditor/likhaeditor-react';

export function RichTextEditor() {
  return (
    <LikhaEditor
      content="<p>Start writing</p>"
      onChange={(html) => console.log(html)}
      toolbarButtons={['heading', 'bold', 'italic', 'link', 'undo', 'redo']}
    />
  );
}
```

Use `useEditor` when you need the underlying instance:

```tsx
import { useEditor } from '@likhaeditor/likhaeditor-react';

const { hostRef, instance, ready } = useEditor({ content: '<p></p>' });
return <div ref={hostRef} />;
```

Destroy is handled automatically on unmount. Avoid calling `setContent` on every render.

See [configuration](/guide/configuration) and [professional editing](/guide/professional-editing).

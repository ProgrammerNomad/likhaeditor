# React integration

Use the vanilla adapter inside a client component. A dedicated React package is planned; it is not required for this integration. New development features require the local build until the next npm release.

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { createEditor } from '@likhaeditor/likhaeditor';
import '@likhaeditor/likhaeditor/dist/likha-editor.css';

export function RichTextEditor() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const instance = createEditor({
      element: host.current,
      content: '<p>Start writing</p>',
      onChange: html => console.log(html),
    });
    return () => instance.destroy();
  }, []);
  return <div ref={host} />;
}
```

Keep the instance for programmatic updates. Avoid calling `setContent` on every render: it replaces the document and can disrupt selection. Destroy the instance when the component unmounts, including during React development remounts.

See [configuration](/guide/configuration) and [persistence adapters](/guide/professional-editing).

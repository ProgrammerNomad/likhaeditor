# React Integration

::: warning Coming Soon
The React integration for LikhaEditor is currently under development and will be available in **v0.1.0** (January 2026).
:::

## Planned Features

The `@likhaeditor/likhaeditor-react` package will provide:

- **React Component** - Drop-in `<LikhaEditor>` component
- **Hooks API** - `useEditor()` hook for custom implementations
- **TypeScript Support** - Full type definitions included
- **Controlled & Uncontrolled** - Both modes supported
- **SSR Compatible** - Works with Next.js and other SSR frameworks

## Preview Usage

```jsx
import { LikhaEditor } from '@likhaeditor/likhaeditor-react';
import '@likhaeditor/likhaeditor/dist/likha-editor.css';

function MyComponent() {
  const [content, setContent] = useState('<p>Initial content</p>');

  return (
    <LikhaEditor
      value={content}
      onChange={setContent}
      placeholder="Start writing..."
    />
  );
}
```

## useEditor Hook

```jsx
import { useEditor } from '@likhaeditor/likhaeditor-react';

function CustomEditor() {
  const editor = useEditor({
    content: '<p>Hello World</p>',
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
    }
  });

  return <div ref={editor.ref} />;
}
```

## Next.js Integration

```jsx
// Works with App Router and Pages Router
import dynamic from 'next/dynamic';

const LikhaEditor = dynamic(
  () => import('@likhaeditor/likhaeditor-react').then(mod => mod.LikhaEditor),
  { ssr: false }
);

export default function Page() {
  return <LikhaEditor />;
}
```

## Current Workaround

While the React package is in development, you can use the vanilla JavaScript version:

```jsx
import { useEffect, useRef } from 'react';
import { createEditor } from '@likhaeditor/likhaeditor';
import '@likhaeditor/likhaeditor/dist/likha-editor.css';

function Editor({ value, onChange }) {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !instanceRef.current) {
      const { editor } = createEditor({
        element: editorRef.current,
        content: value,
        onChange: (html) => onChange?.(html)
      });
      instanceRef.current = editor;
    }

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current && value !== instanceRef.current.getHTML()) {
      instanceRef.current.setContent(value);
    }
  }, [value]);

  return <div ref={editorRef} />;
}
```

## Get Notified

Want to be notified when the React package is released?

- ⭐ [Star the repo](https://github.com/ProgrammerNomad/likhaeditor) on GitHub
- 👀 [Watch releases](https://github.com/ProgrammerNomad/likhaeditor/releases)
- 💬 [Join discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)

## Contributing

Interested in helping build the React integration? Check out:

- [GitHub Issues](https://github.com/ProgrammerNomad/likhaeditor/issues) - See what needs to be done
- [Contributing Guide](/guide/contributing) - Learn how to contribute
- [Architecture Docs](/api/core) - Understand the core API

## Timeline

- **v0.1.0** (January 2026) - Initial React package release
- **v0.2.0** (February 2026) - Advanced React features (controlled components, hooks)
- **v0.3.0** (March 2026) - Next.js App Router optimizations

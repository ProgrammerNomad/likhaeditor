# @likhaeditor/likhaeditor-react

React component and hooks for Likha Editor.

```tsx
import { LikhaEditor } from '@likhaeditor/likhaeditor-react';

export function EditorField() {
  return (
    <LikhaEditor
      content="<p>Hello</p>"
      onChange={(html) => console.log(html)}
      toolbarButtons={['bold', 'italic', 'link']}
    />
  );
}
```

Peer dependencies: `react` and `react-dom` 18+.

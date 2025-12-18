# Readonly Mode

Display rich content without editing capabilities.

::: tip Live Demo
Copy the code below and open it in your browser to see a working demo.
:::

## Code

```javascript
import { createEditor } from '@nomadprogrammer/likha';

const instance = createEditor({
  element: '#editor',
  toolbar: false,  // Hide toolbar
  content: '<p>Read-only content here...</p>'
});

// Make editor non-editable
instance.editor.view.dom.setAttribute('contenteditable', 'false');
instance.editor.view.dom.style.cursor = 'default';
```

## Use Cases

### Content Preview

Display formatted content before publishing:

```javascript
const previewInstance = createEditor({
  element: '#preview',
  toolbar: false,
  content: articleContent
});
previewInstance.editor.view.dom.setAttribute('contenteditable', 'false');
```

### Help Text / Documentation

Show formatted instructions:

```javascript
createEditor({
  element: '#help-text',
  toolbar: false,
  content: `
    <h3>How to Use</h3>
    <ol>
      <li>Select text to format</li>
      <li>Click toolbar buttons</li>
      <li>Save your work</li>
    </ol>
  `
}).editor.view.dom.setAttribute('contenteditable', 'false');
```

### User Comments Display

Render user-generated content safely:

```javascript
const renderComment = (commentHtml) => {
  const container = document.createElement('div');
  container.className = 'comment';
  document.getElementById('comments').appendChild(container);
  
  const instance = createEditor({
    element: container,
    toolbar: false,
    content: commentHtml
  });
  
  instance.editor.view.dom.setAttribute('contenteditable', 'false');
  instance.editor.view.dom.style.cursor = 'default';
};
```

## Styling

You can style readonly editors differently:

```css
.readonly-editor {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  padding: 16px;
  border-radius: 4px;
}

.readonly-editor .ProseMirror {
  cursor: default !important;
}
```

## Toggle Readonly

Allow users to switch between view and edit modes:

```javascript
const instance = createEditor({
  element: '#editor',
  content: '<p>Content here...</p>'
});

let isReadonly = false;

function toggleReadonly() {
  isReadonly = !isReadonly;
  
  instance.editor.view.dom.setAttribute(
    'contenteditable',
    isReadonly ? 'false' : 'true'
  );
  
  // Hide/show toolbar
  const toolbar = document.getElementById('toolbar');
  toolbar.style.display = isReadonly ? 'none' : 'block';
}
```

## Security Note

Always sanitize user-generated content before displaying:

```javascript
import DOMPurify from 'dompurify';

const cleanContent = DOMPurify.sanitize(userContent);

createEditor({
  element: '#display',
  toolbar: false,
  content: cleanContent
}).editor.view.dom.setAttribute('contenteditable', 'false');
```

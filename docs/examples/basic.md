# Basic Editor

The simplest possible Likha Editor setup.

::: tip Live Demo
Copy the code below and open it in your browser to see a working demo.
:::

## Code

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Likha Editor - Basic Example</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">
</head>
<body>
  <div id="editor"></div>

  <script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
  <script>
    const { createEditor } = LikhaEditor;
    
    createEditor({
      element: document.getElementById('editor'),
      content: '<p>Start writing...</p>'
    });
  </script>
</body>
</html>
```

### JavaScript (ES Module)

```javascript
import { createEditor } from '@likhaeditor/likhaeditor';
import '@likhaeditor/likhaeditor/dist/likha-editor.css';

createEditor({
  element: '#editor',
  content: '<p>Start writing...</p>'
});
```

## Features Included

- All basic formatting (bold, italic, underline, etc.)
- Headings (H1-H6)
- Lists (bullet and numbered)
- Links
- Images
- Tables
- Text alignment
- Text color and highlight
- Full toolbar with all buttons

## Customization

See [Custom Toolbar](/examples/custom-toolbar) to learn how to choose which buttons appear.

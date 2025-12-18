# @likhaeditor/likhaeditor

Vanilla JavaScript wrapper for Likha editor - works without build tools.

## Installation

### npm

```bash
npm install @likhaeditor/likhaeditor
```

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">
<script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
```

## Usage

### ES Module

```javascript
import { createEditor } from '@likhaeditor/likhaeditor';
import '@likhaeditor/likhaeditor/dist/likha-editor.css';

createEditor({
  element: '#editor',
  content: '<p>Start writing...</p>'
});
```

### CDN (Browser)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">
</head>
<body>
  <div id="editor"></div>

  <script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
  <script>
    const { createEditor } = LikhaEditor;
    
    createEditor({
      element: document.getElementById('editor'),
      content: '<p>Hello, Likha!</p>'
    });
  </script>
</body>
</html>
```

## Features

- No build tools required
- Full toolbar with all formatting options
- Customizable toolbar buttons
- Works in all modern browsers
- TypeScript support

## Custom Toolbar

```javascript
createEditor({
  element: '#editor',
  toolbarButtons: [
    'heading',
    'bold',
    'italic',
    'link',
    'bulletList',
    'orderedList'
  ]
});
```

## Documentation

Full documentation: https://likhaeditor.netlify.app/

Getting Started: https://likhaeditor.netlify.app/guide/getting-started

API Reference: https://likhaeditor.netlify.app/api/html

## License

MIT © [Shiv Singh](https://github.com/ProgrammerNomad)

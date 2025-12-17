# Getting Started

## Installation

### Using CDN (Quickest)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Likha Editor Demo</title>
</head>
<body>
  <div id="toolbar"></div>
  <div id="editor"></div>

  <script src="https://unpkg.com/@likha/html@latest/dist/likha-editor.umd.js"></script>
  <script>
    const { createEditor } = LikhaEditor;
    
    const editor = createEditor({
      element: document.getElementById('editor'),
      toolbarContainer: document.getElementById('toolbar'),
      content: '<p>Hello, Likha!</p>'
    });
  </script>
</body>
</html>
```

### Using npm/pnpm

```bash
pnpm add @likha/html
# or
npm install @likha/html
```

```javascript
import { createEditor } from '@likha/html';

const editor = createEditor({
  element: document.getElementById('editor'),
  toolbarContainer: document.getElementById('toolbar'),
  content: '<p>Start editing...</p>',
  onChange: (html) => {
    console.log('Content changed:', html);
  }
});
```

## Basic Usage

### Creating an Editor

```javascript
const editor = createEditor({
  // Required: Element to mount editor
  element: document.getElementById('editor'),
  
  // Optional: Toolbar container
  toolbarContainer: document.getElementById('toolbar'),
  
  // Optional: Initial content (HTML string)
  content: '<p>Initial content</p>',
  
  // Optional: Change callback
  onChange: (html) => {
    console.log(html);
  },
  
  // Optional: Placeholder text
  placeholder: 'Start typing...',
  
  // Optional: Read-only mode
  editable: true
});
```

### Getting Content

```javascript
// Get HTML content
const html = editor.getContent();

// Get as JSON (ProseMirror document)
const json = editor.editor.getJSON();
```

### Setting Content

```javascript
// Set HTML content
editor.setContent('<p>New content</p>');

// Or use editor API
editor.editor.setContent('<h1>New Title</h1>');
```

### Destroying Editor

```javascript
editor.destroy();
```

## Available Toolbar Features

The default toolbar includes:

- **Text Formatting:** Bold, Italic, Underline, Strikethrough
- **Headings:** H1-H6
- **Lists:** Bullet and Numbered lists
- **Alignment:** Left, Center, Right, Justify
- **Insert:** Link, Image, Table, Horizontal Rule, Code Block
- **Advanced:** Text Color, Highlight, Subscript, Superscript
- **Actions:** Undo, Redo, Clear Formatting, HTML Source View

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Shift+S` | Strikethrough |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+K` | Insert Link |
| `Ctrl+Shift+8` | Bullet List |
| `Ctrl+Shift+9` | Numbered List |
| `Ctrl+,` | Subscript |
| `Ctrl+.` | Superscript |
| `Ctrl+\` | Clear Formatting |
| `Enter` (in list) | New list item |

## Next Steps

- [Installation Guide](./installation.md) - Detailed installation for different frameworks
- [API Reference](./api/README.md) - Complete API documentation
- [Plugins](./plugins/README.md) - Available plugins and how to use them
- [Customization](./customization.md) - Customize toolbar and behavior

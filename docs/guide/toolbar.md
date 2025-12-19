# Toolbar

Customize the editor toolbar to match your needs.

::: warning Coming Soon
Advanced toolbar customization is planned for **v0.1.0** (January 2026).

Current version (v0.0.1) includes a default toolbar with all formatting options enabled.
:::

## Current Default Toolbar

The current version includes these toolbar items by default:

### Text Formatting
- **Bold** - Make text bold
- **Italic** - Make text italic  
- **Underline** - Underline text
- **Strike** - Strikethrough text
- **Code** - Inline code formatting

### Headings
- **Heading 1** - Large heading
- **Heading 2** - Medium heading
- **Heading 3** - Small heading

### Lists
- **Bullet List** - Unordered list
- **Ordered List** - Numbered list

### Block Elements
- **Blockquote** - Quote formatting
- **Code Block** - Multi-line code
- **Horizontal Rule** - Divider line

### Tables (Coming Soon)
- **Insert Table** - Add tables
- **Table Operations** - Merge, split cells

### Media (Coming Soon)
- **Insert Image** - Add images
- **Insert Link** - Add hyperlinks

## Keyboard Shortcuts

The toolbar items can be accessed via keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` (Mac: `Cmd+B`) | Bold |
| `Ctrl+I` (Mac: `Cmd+I`) | Italic |
| `Ctrl+U` (Mac: `Cmd+U`) | Underline |
| `Ctrl+Shift+X` | Strike |
| `Ctrl+E` | Code |
| `Ctrl+Alt+1` | Heading 1 |
| `Ctrl+Alt+2` | Heading 2 |
| `Ctrl+Alt+3` | Heading 3 |
| `Ctrl+Shift+8` | Bullet list |
| `Ctrl+Shift+9` | Ordered list |
| `Ctrl+Shift+B` | Blockquote |

## Planned Features (v0.1.0)

### Custom Toolbar Items

```javascript
// Future API
const editor = LikhaEditor.createEditor({
  element: document.getElementById('editor'),
  toolbar: {
    items: [
      'bold', 'italic', 'underline',
      '|', // Separator
      'heading1', 'heading2',
      '|',
      'bulletList', 'orderedList'
    ]
  }
});
```

### Toolbar Position

```javascript
// Future API
const editor = LikhaEditor.createEditor({
  toolbar: {
    position: 'bottom', // or 'top' (default)
    sticky: true // Stick to viewport when scrolling
  }
});
```

### Custom Toolbar Buttons

```javascript
// Future API
const editor = LikhaEditor.createEditor({
  toolbar: {
    customButtons: [
      {
        name: 'save',
        icon: '<svg>...</svg>',
        title: 'Save Document',
        action: () => {
          // Custom save logic
        }
      }
    ]
  }
});
```

### Hide Toolbar

```javascript
// Future API
const editor = LikhaEditor.createEditor({
  toolbar: false // No toolbar
});
```

## Styling the Toolbar

You can style the toolbar with custom CSS:

```css
/* Toolbar container */
.likha-toolbar {
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 8px;
}

/* Toolbar buttons */
.likha-toolbar button {
  color: #495057;
  border-radius: 4px;
}

.likha-toolbar button:hover {
  background: #e9ecef;
}

.likha-toolbar button.active {
  background: #007bff;
  color: white;
}
```

## Why is toolbar visible but not working?

If you see the toolbar but clicking buttons does nothing:

1. **Check console for errors** - Open browser DevTools
2. **Verify CDN loaded** - Check `window.LikhaEditor` exists
3. **Check CSS loaded** - Toolbar should have proper styling

**Common fix:** Make sure both CSS and JS are loaded:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">
<script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
```

## Next Steps

- [Configuration Guide](/guide/configuration)
- [Custom Toolbar Example](/examples/custom-toolbar)
- [Plugin Development](/guide/plugins)

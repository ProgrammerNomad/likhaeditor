# Custom Toolbar

Choose which buttons appear in the toolbar to create a simplified editor.

::: tip Live Demo
Copy the code below and open it in your browser to see a working demo.
:::

## Code

```javascript
import { createEditor } from '@nomadprogrammer/likha';

createEditor({
  element: '#editor',
  toolbarContainer: '#toolbar',
  toolbarButtons: [
    'heading',
    'bold',
    'italic',
    'underline',
    'link',
    'bulletList',
    'orderedList'
  ],
  content: '<p>Custom toolbar content</p>'
});
```

## Available Buttons

You can include any combination of these buttons:

- `'heading'` - Heading dropdown (Paragraph, H1-H6)
- `'undo'` - Undo button
- `'redo'` - Redo button
- `'bold'` - Bold formatting
- `'italic'` - Italic formatting
- `'underline'` - Underline formatting
- `'strikethrough'` - Strikethrough
- `'subscript'` - Subscript
- `'superscript'` - Superscript
- `'clearFormat'` - Clear all formatting
- `'link'` - Insert/edit link
- `'bulletList'` - Bullet list
- `'orderedList'` - Numbered list
- `'blockquote'` - Blockquote
- `'alignLeft'` - Align left
- `'alignCenter'` - Align center
- `'alignRight'` - Align right
- `'textColor'` - Text color picker
- `'highlight'` - Background highlight color
- `'image'` - Insert image
- `'table'` - Insert table
- `'code'` - Code block
- `'hr'` - Horizontal rule
- `'sourceCode'` - View HTML source

## Presets

### Minimal (Text Formatting Only)

```javascript
toolbarButtons: ['bold', 'italic', 'underline', 'clearFormat']
```

### Blog Editor

```javascript
toolbarButtons: [
  'heading',
  'bold',
  'italic',
  'underline',
  'link',
  'bulletList',
  'orderedList',
  'blockquote',
  'image'
]
```

### Comment Editor

```javascript
toolbarButtons: [
  'bold',
  'italic',
  'link',
  'bulletList',
  'code'
]
```

### Full Featured

```javascript
toolbarButtons: 'all'  // Show all available buttons
```

## No Toolbar

Set `toolbar: false` to hide the toolbar completely:

```javascript
createEditor({
  element: '#editor',
  toolbar: false,
  content: '<p>No toolbar editor</p>'
});
```

Useful for:
- Comment boxes
- Read-only display
- Custom UI implementations

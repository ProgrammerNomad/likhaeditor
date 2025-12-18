# HTML Package API

The `@likhaeditor/likhaeditor` package provides a simple wrapper for using Likha in vanilla HTML/JavaScript projects.

## createEditor()

Creates and initializes a Likha editor instance.

```typescript
import { createEditor } from '@likhaeditor/likhaeditor';

const instance = createEditor(options);
```

### Options

```typescript
interface LikhaEditorOptions {
  /** The element or selector to mount the editor */
  element: HTMLElement | string;
  
  /** Initial content (HTML string) */
  content?: string;
  
  /** Placeholder text when editor is empty */
  placeholder?: string;
  
  /** Enable/disable toolbar (default: true) */
  toolbar?: boolean;
  
  /** Toolbar container element or selector */
  toolbarContainer?: HTMLElement | string;
  
  /** Toolbar configuration - specify which buttons to show */
  toolbarButtons?: string[] | 'all';
  
  /** Enable specific plugins */
  plugins?: string[];
  
  /** Enable dark theme */
  darkTheme?: boolean;
  
  /** Callback when content changes */
  onChange?: (content: string) => void;
}
```

### Toolbar Buttons

Available button names for `toolbarButtons`:

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

### Return Value

```typescript
interface EditorInstance {
  editor: Editor;
  toolbar: Toolbar | null;
  getContent: () => string;
  setContent: (html: string) => void;
  destroy: () => void;
}
```

## Examples

### Basic Usage

```javascript
import { createEditor } from '@likhaeditor/likhaeditor';

createEditor({
  element: '#editor',
  content: '<p>Hello, Likha!</p>'
});
```

### Custom Toolbar

```javascript
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
  content: '<p>Custom toolbar editor</p>'
});
```

### With onChange Callback

```javascript
const instance = createEditor({
  element: '#editor',
  content: '<p>Type here...</p>',
  onChange: (html) => {
    console.log('Content changed:', html);
    document.getElementById('output').value = html;
  }
});
```

### Programmatic Control

```javascript
const instance = createEditor({
  element: '#editor'
});

// Get content
const html = instance.getContent();

// Set content
instance.setContent('<p>New content</p>');

// Cleanup
instance.destroy();
```

## CSS Import

Don't forget to include the CSS:

```javascript
import '@likhaeditor/likhaeditor/style.css';
```

Or via HTML:

```html
<link rel="stylesheet" href="@likhaeditor/likhaeditor/style.css">
```

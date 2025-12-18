# Core API

The `@nomadprogrammer/likha-core` package provides the fundamental editor functionality.

## Editor Class

The main editor class that manages the ProseMirror instance.

### Constructor

```typescript
import { Editor } from '@nomadprogrammer/likha-core';

const editor = new Editor({
  element: HTMLElement,
  content?: string,
  schema?: Schema,
  plugins?: Plugin[]
});
```

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `element` | `HTMLElement` | Yes | The DOM element to mount the editor |
| `content` | `string` | No | Initial HTML content |
| `schema` | `Schema` | No | Custom ProseMirror schema (uses default if not provided) |
| `plugins` | `Plugin[]` | No | Array of plugins to load |

### Methods

#### `getHTML(): string`

Returns the current editor content as HTML.

```typescript
const html = editor.getHTML();
console.log(html); // "<p>Editor content</p>"
```

#### `getText(): string`

Returns the current editor content as plain text.

```typescript
const text = editor.getText();
console.log(text); // "Editor content"
```

#### `setContent(content: string): void`

Sets the editor content.

```typescript
editor.setContent('<p>New content</p>');
```

#### `executeCommand(name: string, ...args: any[]): any`

Executes a registered command.

```typescript
editor.executeCommand('bold');
editor.executeCommand('toggleHeading', 2);
editor.executeCommand('setLink', 'https://example.com');
```

#### `isActive(markName: string): boolean`

Checks if a mark is currently active at the selection.

```typescript
if (editor.isActive('bold')) {
  console.log('Bold is active');
}
```

#### `focus(): void`

Focuses the editor.

```typescript
editor.focus();
```

#### `destroy(): void`

Destroys the editor instance.

```typescript
editor.destroy();
```

### Properties

#### `view: EditorView`

The ProseMirror EditorView instance.

```typescript
const view = editor.view;
```

## Plugin Class

Base class for creating custom plugins.

### Example

```typescript
import { Plugin } from '@nomadprogrammer/likha-core';

export class MyPlugin extends Plugin {
  name = 'myPlugin';

  commands() {
    return {
      myCommand: (editor) => {
        // Command logic
        return true;
      }
    };
  }

  keymap() {
    return {
      'Ctrl-Shift-M': (editor, state, dispatch) => {
        // Keymap logic
        return true;
      }
    };
  }

  prosemirrorPlugins() {
    return [];
  }
}
```

### Methods

#### `init(editor: Editor): void`

Called when the plugin is initialized.

#### `commands(): Commands`

Returns an object of command functions.

#### `keymap(): KeyboardShortcuts`

Returns an object of keyboard shortcuts.

#### `prosemirrorPlugins(): ProseMirrorPlugin[]`

Returns an array of ProseMirror plugins.

#### `destroy(): void`

Cleanup when plugin is destroyed.

## Schema

The default Likha schema extends ProseMirror's basic schema with:

- **Nodes**: `doc`, `paragraph`, `heading` (1-6), `blockquote`, `horizontal_rule`, `code_block`, `text`, `hard_break`, `bullet_list`, `ordered_list`, `list_item`, `table`, `table_row`, `table_cell`, `table_header`, `image`
- **Marks**: `strong`, `em`, `code`, `link`, `underline`, `strikethrough`, `subscript`, `superscript`, `textColor`, `highlight`

## Type Exports

```typescript
import type {
  Editor,
  Plugin,
  EditorOptions,
  Commands,
  KeyboardShortcuts,
  PluginRegistry
} from '@nomadprogrammer/likha-core';
```

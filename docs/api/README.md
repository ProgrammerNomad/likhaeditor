# API Reference

## @nomadprogrammer/likha

### `createEditor(options)`

Creates a new editor instance with toolbar.

#### Parameters

```typescript
interface CreateEditorOptions {
  /** Element to mount editor (required) */
  element: HTMLElement;
  
  /** Toolbar container element (optional) */
  toolbarContainer?: HTMLElement | string;
  
  /** Initial HTML content (optional) */
  content?: string;
  
  /** Placeholder text when editor is empty (optional) */
  placeholder?: string;
  
  /** Enable/disable editing (optional, default: true) */
  editable?: boolean;
  
  /** Show/hide toolbar (optional, default: true) */
  toolbar?: boolean;
  
  /** Callback when content changes (optional) */
  onChange?: (html: string) => void;
}
```

#### Returns

```typescript
interface EditorInstance {
  /** Core editor instance */
  editor: Editor;
  
  /** Toolbar instance */
  toolbar: Toolbar | null;
  
  /** Get current HTML content */
  getContent: () => string;
  
  /** Set HTML content */
  setContent: (html: string) => void;
  
  /** Destroy editor and cleanup */
  destroy: () => void;
}
```

#### Example

```javascript
import { createEditor } from '@nomadprogrammer/likha';

const instance = createEditor({
  element: document.getElementById('editor'),
  toolbarContainer: '#toolbar',
  content: '<p>Hello world</p>',
  placeholder: 'Start typing...',
  onChange: (html) => {
    console.log('Content:', html);
  }
});

// Get content
const html = instance.getContent();

// Set content
instance.setContent('<h1>New content</h1>');

// Cleanup
instance.destroy();
```

## @nomadprogrammer/likha-core

### `Editor`

Core editor class.

#### Constructor

```typescript
new Editor(options: EditorOptions)

interface EditorOptions {
  element: HTMLElement;
  content?: string;
  placeholder?: string;
  editable?: boolean;
  plugins?: Plugin[];
  onChange?: (html: string) => void;
}
```

#### Methods

##### Content Management

- `getHTML(): string` - Get editor content as HTML
- `getJSON(): any` - Get editor content as JSON
- `setContent(html: string): void` - Set editor content from HTML
- `clear(): void` - Clear all content

##### Formatting Commands

- `bold(): boolean` - Toggle bold
- `italic(): boolean` - Toggle italic
- `underline(): boolean` - Toggle underline
- `toggleHeading(level: 1-6): boolean` - Toggle heading

##### Command Execution

- `executeCommand(name: string, ...args: any[]): boolean` - Execute any registered command

##### State

- `view: EditorView` - ProseMirror view instance
- `state: EditorState` - Current editor state

#### Example

```javascript
import { Editor } from '@nomadprogrammer/likha-core';
import { BoldPlugin, ItalicPlugin } from '@nomadprogrammer/likha-plugins';

const editor = new Editor({
  element: document.getElementById('editor'),
  plugins: [new BoldPlugin(), new ItalicPlugin()],
  onChange: (html) => {
    console.log(html);
  }
});

// Use commands
editor.bold();
editor.italic();
editor.toggleHeading(2);

// Execute plugin commands
editor.executeCommand('toggleBulletList');
```

## @nomadprogrammer/likha-ui

### `Toolbar`

Toolbar component for editor controls.

#### Constructor

```typescript
new Toolbar(options: ToolbarOptions)

interface ToolbarOptions {
  container: HTMLElement;
  sticky?: boolean;
}
```

#### Methods

- `addButton(button: HTMLElement): void` - Add button to toolbar
- `addGroup(buttons: HTMLElement[]): void` - Add button group
- `addSeparator(): void` - Add separator
- `clear(): void` - Remove all buttons
- `destroy(): void` - Cleanup toolbar

### `Button`

Button component.

#### Constructor

```typescript
new Button(options: ButtonOptions)

interface ButtonOptions {
  icon?: string;
  text?: string;
  title?: string;
  onClick?: (e: MouseEvent) => void;
  isActive?: () => boolean;
}
```

#### Methods

- `getElement(): HTMLElement` - Get button DOM element
- `setActive(active: boolean): void` - Set active state

## @nomadprogrammer/likha-plugins

All plugins extend the base `Plugin` class:

```typescript
abstract class Plugin {
  abstract name: string;
  commands?(): Record<string, Function>;
  keymap?(): Record<string, Function>;
  prosemirrorPlugins?(): ProsemirrorPlugin[];
  init?(editor: Editor): void;
}
```

### Available Plugins

- `PlaceholderPlugin` - Placeholder text
- `CharacterCountPlugin` - Character counting
- `HeadingPlugin` - Headings (H1-H6)
- `BulletListPlugin` - Bullet lists
- `OrderedListPlugin` - Numbered lists
- `BlockquotePlugin` - Blockquotes
- `TextAlignmentPlugin` - Text alignment
- `LinkPlugin` - Hyperlinks
- `ImagePlugin` - Images
- `TablePlugin` - Tables
- `HorizontalRulePlugin` - Horizontal rules
- `CodeBlockPlugin` - Code blocks
- `TextColorPlugin` - Text color
- `HighlightPlugin` - Text highlight
- `StrikethroughPlugin` - Strikethrough
- `SubscriptPlugin` - Subscript
- `SuperscriptPlugin` - Superscript
- `ClearFormattingPlugin` - Clear formatting
- `HTMLSourceViewPlugin` - HTML source view

See [Plugins Documentation](../plugins/README.md) for detailed usage.

## Next Steps

- [Plugins Guide](../plugins/README.md)
- [Customization](../customization.md)
- [Examples](../examples.md)

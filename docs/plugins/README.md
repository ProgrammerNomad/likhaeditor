# Plugins

Likha uses a plugin-based architecture. All features are implemented as plugins.

## Core Concept

Each plugin can provide:
- **Commands** - Programmatic actions
- **Keymaps** - Keyboard shortcuts
- **ProseMirror Plugins** - Advanced functionality
- **Initialization** - Setup logic

## Using Plugins

### With @nomadprogrammer/likha

All plugins are loaded by default:

```javascript
import { createEditor } from '@nomadprogrammer/likha';

// All 19 plugins automatically loaded
const editor = createEditor({
  element: document.getElementById('editor')
});
```

### With @nomadprogrammer/likha-core

Load only what you need:

```javascript
import { Editor } from '@nomadprogrammer/likha-core';
import { 
  BoldPlugin, 
  ItalicPlugin, 
  HeadingPlugin 
} from '@nomadprogrammer/likha-plugins';

const editor = new Editor({
  element: document.getElementById('editor'),
  plugins: [
    new BoldPlugin(),
    new ItalicPlugin(),
    new HeadingPlugin()
  ]
});
```

## Available Plugins

### Text Formatting

#### BoldPlugin
- **Command:** `toggleBold`
- **Shortcut:** `Ctrl+B`

#### ItalicPlugin
- **Command:** `toggleItalic`
- **Shortcut:** `Ctrl+I`

#### UnderlinePlugin
- **Command:** `toggleUnderline`
- **Shortcut:** `Ctrl+U`

#### StrikethroughPlugin
- **Command:** `toggleStrikethrough`
- **Shortcut:** `Ctrl+Shift+S`

#### SubscriptPlugin
- **Command:** `toggleSubscript`
- **Shortcut:** `Ctrl+,`
- Example: H₂O

#### SuperscriptPlugin
- **Command:** `toggleSuperscript`
- **Shortcut:** `Ctrl+.`
- Example: E=mc²

#### ClearFormattingPlugin
- **Command:** `clearFormat`
- **Shortcut:** `Ctrl+\`
- Removes all marks and resets to paragraph

### Structure

#### HeadingPlugin
- **Command:** `toggleHeading(level: 1-6)`
- **Shortcuts:** `Ctrl+Alt+1` through `Ctrl+Alt+6`

#### BulletListPlugin
- **Command:** `toggleBulletList`
- **Shortcut:** `Ctrl+Shift+8`
- **Enter:** Creates new list item

#### OrderedListPlugin
- **Command:** `toggleOrderedList`
- **Shortcut:** `Ctrl+Shift+9`
- **Enter:** Creates new numbered item

#### BlockquotePlugin
- **Command:** `toggleBlockquote`
- **Shortcut:** `Ctrl+Shift+B`

### Alignment

#### TextAlignmentPlugin
- **Commands:**
  - `setTextAlign(alignment: 'left' | 'center' | 'right' | 'justify')`
  - `setAlignLeft`, `setAlignCenter`, `setAlignRight`, `setAlignJustify`
- **Shortcuts:**
  - `Ctrl+Shift+L`: Left
  - `Ctrl+Shift+E`: Center
  - `Ctrl+Shift+R`: Right
  - `Ctrl+Shift+J`: Justify

### Insert Elements

#### LinkPlugin
- **Commands:**
  - `insertLink(url: string, text?: string)`
  - `removeLink()`
- **Shortcut:** `Ctrl+K`

#### ImagePlugin
- **Command:** `insertImage(src: string, alt?: string)`

#### TablePlugin
- **Commands:**
  - `insertTable({ rows, cols })`
  - `deleteTable()`
  - `addRowBefore()`, `addRowAfter()`
  - `addColumnBefore()`, `addColumnAfter()`
  - `deleteRow()`, `deleteColumn()`

#### HorizontalRulePlugin
- **Command:** `insertHorizontalRule`

#### CodeBlockPlugin
- **Command:** `toggleCodeBlock`
- **Shortcut:** `Ctrl+Alt+C`

### Styling

#### TextColorPlugin
- **Commands:**
  - `setTextColor(color: string)`
  - `removeTextColor()`
- Color picker UI provided in @nomadprogrammer/likha

#### HighlightPlugin
- **Commands:**
  - `setHighlight(color: string)`
  - `removeHighlight()`
- Color picker UI provided in @nomadprogrammer/likha

### Utility

#### PlaceholderPlugin
```javascript
new PlaceholderPlugin({ 
  placeholder: 'Start typing...' 
})
```

#### CharacterCountPlugin
```javascript
const plugin = new CharacterCountPlugin();
const count = plugin.getCount(editor);
// { characters: 100, words: 20 }
```

#### HTMLSourceViewPlugin
- **Commands:**
  - `toggleSourceView()`
  - `isSourceViewActive()`
- Toggles between visual and HTML source mode

## Creating Custom Plugins

```javascript
import { Plugin } from '@nomadprogrammer/likha-core';

class MyPlugin extends Plugin {
  name = 'myPlugin';
  
  commands() {
    return {
      myCommand: (editor) => {
        // Command implementation
        return true;
      }
    };
  }
  
  keymap() {
    return {
      'Ctrl-m': (editor) => {
        return this.commands().myCommand(editor);
      }
    };
  }
  
  init(editor) {
    // Initialization logic
  }
}

// Use it
const editor = new Editor({
  element: document.getElementById('editor'),
  plugins: [new MyPlugin()]
});

editor.executeCommand('myCommand');
```

## Next Steps

- [API Reference](../api/README.md)
- [Examples](../examples.md)
- [Customization](../customization.md)

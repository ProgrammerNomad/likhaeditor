# Creating Custom Plugins

::: warning Coming Soon
Comprehensive plugin development guide is coming in **v0.2.0** (February 2025).
:::

## Plugin Architecture

LikhaEditor uses a plugin-based architecture where all features are implemented as plugins. This makes the editor highly modular and extensible.

## Quick Start

Here's a basic plugin structure:

```typescript
import { Plugin } from '@likhaeditor/core';

export class MyCustomPlugin extends Plugin {
  name = 'my-custom-plugin';
  
  init(editor) {
    this.editor = editor;
    // Plugin initialization
  }
  
  commands() {
    return {
      myCommand: (editor, ...args) => {
        // Command implementation
        return true;
      }
    };
  }
  
  keymap() {
    return {
      'Mod-Shift-X': (editor, state, dispatch) => {
        // Keyboard shortcut handler
        return true;
      }
    };
  }
  
  prosemirrorPlugins() {
    // Return ProseMirror plugins if needed
    return [];
  }
  
  destroy() {
    // Cleanup when plugin is destroyed
  }
}
```

## Using Your Plugin

```typescript
import { Editor } from '@likhaeditor/core';
import { MyCustomPlugin } from './my-custom-plugin';

const editor = new Editor({
  element: document.getElementById('editor'),
  plugins: [
    new MyCustomPlugin()
  ]
});

// Execute custom command
editor.executeCommand('myCommand');
```

## Plugin Examples

### Simple Format Plugin

```typescript
export class BoldPlugin extends Plugin {
  name = 'bold';
  
  commands() {
    return {
      toggleBold: (editor) => {
        const { state, dispatch } = editor.view;
        const mark = state.schema.marks.strong;
        
        if (!mark) return false;
        
        const { from, to } = state.selection;
        const hasMark = state.doc.rangeHasMark(from, to, mark);
        
        if (hasMark) {
          dispatch(state.tr.removeMark(from, to, mark));
        } else {
          dispatch(state.tr.addMark(from, to, mark.create()));
        }
        
        return true;
      }
    };
  }
  
  keymap() {
    return {
      'Mod-B': (editor) => editor.executeCommand('toggleBold')
    };
  }
}
```

### Custom Block Plugin

```typescript
export class CalloutPlugin extends Plugin {
  name = 'callout';
  
  commands() {
    return {
      insertCallout: (editor, type = 'info') => {
        const { state, dispatch } = editor.view;
        const nodeType = state.schema.nodes.callout;
        
        if (!nodeType) return false;
        
        const node = nodeType.create({ type });
        dispatch(state.tr.replaceSelectionWith(node));
        
        return true;
      }
    };
  }
}
```

### Toolbar Button Plugin

```typescript
export class ToolbarButtonPlugin extends Plugin {
  name = 'toolbar-button';
  
  init(editor) {
    super.init(editor);
    this.addToolbarButton();
  }
  
  addToolbarButton() {
    const toolbar = document.querySelector('.likha-toolbar');
    if (!toolbar) return;
    
    const button = document.createElement('button');
    button.textContent = 'Custom';
    button.addEventListener('click', () => {
      this.editor.executeCommand('myCustomCommand');
    });
    
    toolbar.appendChild(button);
  }
}
```

## Plugin Lifecycle

```typescript
export class MyPlugin extends Plugin {
  // 1. Plugin is instantiated
  constructor(config = {}) {
    super(config);
    this.config = config;
  }
  
  // 2. Editor calls init()
  init(editor) {
    this.editor = editor;
    // Set up event listeners, state, etc.
  }
  
  // 3. Commands are registered
  commands() {
    return {
      // Your commands
    };
  }
  
  // 4. Keyboard shortcuts are registered
  keymap() {
    return {
      // Your shortcuts
    };
  }
  
  // 5. ProseMirror plugins are added
  prosemirrorPlugins() {
    return [
      // ProseMirror plugins
    ];
  }
  
  // 6. Plugin is destroyed when editor is destroyed
  destroy() {
    // Clean up event listeners, intervals, etc.
  }
}
```

## Available APIs

### Editor Instance

```typescript
this.editor.view           // ProseMirror EditorView
this.editor.view.state     // ProseMirror EditorState
this.editor.getHTML()      // Get HTML content
this.editor.setContent()   // Set content
this.editor.executeCommand() // Execute command
```

### Plugin Configuration

```typescript
export class MyPlugin extends Plugin {
  constructor(config = {}) {
    super(config);
  }
  
  getConfig(key, defaultValue) {
    return this.config[key] ?? defaultValue;
  }
}

// Usage
new MyPlugin({
  enabled: true,
  customOption: 'value'
})
```

## Best Practices

1. **Name your plugin** - Use a unique, descriptive name
2. **Clean up resources** - Implement `destroy()` method
3. **Handle errors gracefully** - Don't crash the editor
4. **Document your API** - Help users understand commands
5. **Test thoroughly** - Write unit tests for your plugin
6. **Keep it focused** - One plugin, one responsibility

## Sharing Your Plugin

Built a useful plugin? Share it with the community:

1. **Publish to npm** - Make it easy to install
2. **Add documentation** - README with examples
3. **Share in Discussions** - [Show and Tell](https://github.com/ProgrammerNomad/likhaeditor/discussions/categories/show-and-tell)
4. **Submit to showcase** - We'll feature community plugins

## Full Documentation (Coming Soon)

The complete plugin development guide will include:

- ProseMirror schema customization
- Transaction manipulation
- Event system
- State management
- Collaborative editing hooks
- Testing strategies
- TypeScript best practices
- Real-world examples

## Get Help

- 💬 [Ask in Discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)
- 📖 [Read Core API](/api/core)
- 🔍 [Browse Built-in Plugins](/api/plugins)
- 🐛 [Report Issues](https://github.com/ProgrammerNomad/likhaeditor/issues)

## Contributing

Want to contribute your plugin to the official package?

1. Fork the repository
2. Add your plugin to `packages/plugins/src/`
3. Write tests
4. Update documentation
5. Submit a pull request

See our [Contributing Guide](https://github.com/ProgrammerNomad/likhaeditor/blob/main/CONTRIBUTING.md) for details.

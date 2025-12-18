# @likhaeditor/core

Core editor engine for Likha - framework-agnostic rich text editor built on ProseMirror.

## Installation

```bash
npm install @likhaeditor/core
# or
pnpm add @likhaeditor/core
# or
yarn add @likhaeditor/core
```

## Usage

```typescript
import { Editor } from '@likhaeditor/core';

const editor = new Editor({
  element: document.getElementById('editor'),
  content: '<p>Hello, Likha!</p>'
});
```

## Features

- Framework-agnostic ProseMirror-based editor
- Plugin architecture
- TypeScript support
- Full keyboard navigation
- Undo/redo support

## Documentation

Full documentation: https://likhaeditor.netlify.app/

API Reference: https://likhaeditor.netlify.app/api/core

## License

MIT © [Shiv Singh](https://github.com/ProgrammerNomad)

// Get content
const html = editor.getHTML();

// Set content
editor.setContent('<p>New content</p>');

// Focus
editor.focus();

// Cleanup
editor.destroy();
```

## Features

- Framework-agnostic
- Built on ProseMirror
- Undo/Redo support
- Extensible via plugins
- TypeScript support

## License

MIT

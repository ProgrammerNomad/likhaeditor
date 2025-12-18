# Getting Started

Welcome to Likha Editor! This guide will help you get started with the editor.

## What is Likha?

Likha is a modern, framework-agnostic rich text editor built on top of ProseMirror. It provides a simple API while maintaining powerful extensibility through plugins.

## Key Features

- **Framework Agnostic**: Works with vanilla HTML, React, Laravel, and Livewire
- **Lightweight**: Only 75KB gzipped
- **Customizable Toolbar**: Choose which buttons to show
- **Plugin System**: 19+ built-in plugins, easy to create custom ones
- **Self-Hosted**: No cloud services, complete data privacy
- **TypeScript**: Fully typed for excellent developer experience
- **MIT Licensed**: Free for commercial use

## Installation

Choose your preferred method:

### NPM (Recommended)

```bash
npm install @nomadprogrammer/likha
```

### pnpm

```bash
pnpm add @nomadprogrammer/likha
```

### Yarn

```bash
yarn add @nomadprogrammer/likha
```

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nomadprogrammer/likha/dist/likha-editor.css">
<script src="https://cdn.jsdelivr.net/npm/@nomadprogrammer/likha/dist/likha-editor.umd.js"></script>
```

## Basic Usage

### HTML + CDN

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nomadprogrammer/likha/dist/likha-editor.css">
</head>
<body>
  <div id="editor"></div>

  <script src="https://cdn.jsdelivr.net/npm/@nomadprogrammer/likha/dist/likha-editor.umd.js"></script>
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

### ES Module

```javascript
import '@nomadprogrammer/likha/dist/likha-editor.css';
import { createEditor } from '@nomadprogrammer/likha';

createEditor({
  element: document.getElementById('editor'),
  content: '<p>Hello, Likha!</p>'
});
```

## Next Steps

- [Installation Guide](/guide/installation) - Detailed installation instructions
- [Configuration](/guide/configuration) - Learn about all configuration options
- [Toolbar Customization](/guide/toolbar) - Customize which buttons appear
- [Examples](/examples/) - See Likha in action

## Need Help?

- [GitHub Issues](https://github.com/ProgrammerNomad/likha/issues) - Report bugs or request features
- [Discussions](https://github.com/ProgrammerNomad/likha/discussions) - Ask questions

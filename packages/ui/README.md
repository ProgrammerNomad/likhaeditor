# @likhaeditor/ui

UI components for Likha editor - toolbars, menus, and controls.

## Installation

```bash
npm install @likhaeditor/ui @likhaeditor/core
```

## Usage

```typescript
import { Toolbar } from '@likhaeditor/ui';
import { Editor } from '@likhaeditor/core';

const editor = new Editor({ element: document.getElementById('editor') });
const toolbar = new Toolbar({
  container: document.getElementById('toolbar'),
  buttons: [/* button config */]
});
```

## Features

- Customizable toolbar
- Menu bar component
- Color pickers
- Button components
- Dropdown menus
- Theme support

## Documentation

Full documentation: https://likhaeditor.netlify.app/

API Reference: https://likhaeditor.netlify.app/api/ui

## License

MIT © [Shiv Singh](https://github.com/ProgrammerNomad)

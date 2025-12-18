# @likhaeditor/plugins

Official plugins for Likha editor.

## Installation

```bash
npm install @likhaeditor/plugins @likhaeditor/core
```

## Usage

```typescript
import { Editor } from '@likhaeditor/core';
import { BulletListPlugin, OrderedListPlugin } from '@likhaeditor/plugins';

const editor = new Editor({
  element: document.getElementById('editor'),
  plugins: [
    new BulletListPlugin(),
    new OrderedListPlugin()
  ]
});
```

## Available Plugins

- **Lists**: BulletListPlugin, OrderedListPlugin
- **Text Formatting**: StrikethroughPlugin, SubscriptPlugin, SuperscriptPlugin
- **Blocks**: BlockquotePlugin, CodeBlockPlugin
- **Links**: LinkPlugin
- **Media**: ImagePlugin, TablePlugin
- **Colors**: TextColorPlugin, HighlightPlugin
- **Alignment**: TextAlignmentPlugin
- **Utilities**: ClearFormattingPlugin, PlaceholderPlugin, CharacterCountPlugin

## Documentation

Full documentation: https://likhaeditor.netlify.app/

API Reference: https://likhaeditor.netlify.app/api/plugins

## License

MIT © [Shiv Singh](https://github.com/ProgrammerNomad)

# @nomadprogrammer/likha-plugins

Official plugins for Likha editor.

## Installation

```bash
npm install @nomadprogrammer/likha-plugins @nomadprogrammer/likha-core
```

## Usage

```typescript
import { Editor } from '@nomadprogrammer/likha-core';
import { BulletListPlugin, OrderedListPlugin } from '@nomadprogrammer/likha-plugins';

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

Full documentation: https://likha-doc.netlify.app/

API Reference: https://likha-doc.netlify.app/api/plugins

## License

MIT © [Shiv Singh](https://github.com/ProgrammerNomad)

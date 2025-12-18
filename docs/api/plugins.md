# Plugins API

All available plugins in the `@likhaeditor/plugins` package.

## Built-in Plugins

### HeadingPlugin

Adds support for headings (H1-H6).

```typescript
import { HeadingPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `toggleHeading(level: number)` - Toggle heading level (1-6)
- `setParagraph()` - Convert to paragraph

**Keyboard Shortcuts:**
- `Ctrl-Alt-1` to `Ctrl-Alt-6` - Set heading level

---

### BulletListPlugin

Adds unordered (bullet) list support.

```typescript
import { BulletListPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `toggleBulletList()` - Toggle bullet list
- `isBulletListActive()` - Check if in bullet list

**Keyboard Shortcuts:**
- `Ctrl-Shift-8` - Toggle bullet list

---

### OrderedListPlugin

Adds ordered (numbered) list support.

```typescript
import { OrderedListPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `toggleOrderedList()` - Toggle ordered list
- `isOrderedListActive()` - Check if in ordered list

**Keyboard Shortcuts:**
- `Ctrl-Shift-9` - Toggle ordered list

---

### BlockquotePlugin

Adds blockquote support.

```typescript
import { BlockquotePlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `toggleBlockquote()` - Toggle blockquote

**Keyboard Shortcuts:**
- `Ctrl-Shift-B` - Toggle blockquote

---

### LinkPlugin

Adds hyperlink support.

```typescript
import { LinkPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `setLink(url: string)` - Insert/update link
- `unsetLink()` - Remove link

**Keyboard Shortcuts:**
- `Ctrl-K` - Insert/edit link

---

### TextColorPlugin

Adds text color support with 80-color palette.

```typescript
import { TextColorPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `setTextColor(color: string)` - Set text color
- `removeTextColor()` - Remove text color

---

### HighlightPlugin

Adds background highlight color with 80-color palette.

```typescript
import { HighlightPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `setHighlight(color: string)` - Set background color
- `removeHighlight()` - Remove highlight

---

### TextAlignmentPlugin

Adds text alignment (left, center, right, justify).

```typescript
import { TextAlignmentPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `setTextAlign(alignment: 'left' | 'center' | 'right' | 'justify')` - Set alignment

**Keyboard Shortcuts:**
- `Ctrl-Shift-L` - Align left
- `Ctrl-Shift-E` - Align center
- `Ctrl-Shift-R` - Align right
- `Ctrl-Shift-J` - Justify

---

### TablePlugin

Adds table support.

```typescript
import { TablePlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `insertTable(rows: number, cols: number)` - Insert table
- `deleteTable()` - Delete table
- `addRowBefore()` - Add row before current
- `addRowAfter()` - Add row after current
- `deleteRow()` - Delete current row
- `addColumnBefore()` - Add column before current
- `addColumnAfter()` - Add column after current
- `deleteColumn()` - Delete current column

---

### ImagePlugin

Adds image support.

```typescript
import { ImagePlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `insertImage(src: string, alt?: string, title?: string)` - Insert image
- `updateImage(src: string, alt?: string, title?: string)` - Update image attributes

---

### CodeBlockPlugin

Adds code block support.

```typescript
import { CodeBlockPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `toggleCodeBlock()` - Toggle code block

**Keyboard Shortcuts:**
- `Ctrl-Alt-C` - Toggle code block

---

### StrikethroughPlugin

Adds strikethrough formatting.

```typescript
import { StrikethroughPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `toggleStrikethrough()` - Toggle strikethrough

---

### SubscriptPlugin

Adds subscript formatting.

```typescript
import { SubscriptPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `toggleSubscript()` - Toggle subscript

---

### SuperscriptPlugin

Adds superscript formatting.

```typescript
import { SuperscriptPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `toggleSuperscript()` - Toggle superscript

---

### ClearFormattingPlugin

Removes all formatting from selection.

```typescript
import { ClearFormattingPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `clearFormat()` - Remove all formatting

---

### PlaceholderPlugin

Adds placeholder text when editor is empty.

```typescript
import { PlaceholderPlugin } from '@likhaeditor/plugins';
```

**Options:**
```typescript
new PlaceholderPlugin({
  placeholder: 'Start typing...'
})
```

---

### CharacterCountPlugin

Tracks character and word count.

```typescript
import { CharacterCountPlugin } from '@likhaeditor/plugins';
```

**Commands:**
- `getCharacterCount()` - Get character count
- `getWordCount()` - Get word count

---

## Creating Custom Plugins

```typescript
import { Plugin } from '@likhaeditor/core';

export class MyCustomPlugin extends Plugin {
  name = 'myCustom';

  commands() {
    return {
      myCommand: (editor) => {
        // Your command logic
        return true;
      }
    };
  }

  keymap() {
    return {
      'Ctrl-M': (editor, state, dispatch) => {
        // Your keymap logic
        return true;
      }
    };
  }

  init(editor) {
    // Initialization logic
  }

  destroy() {
    // Cleanup logic
  }
}
```

See [Creating Plugins](/guide/custom-plugins) for detailed guide.

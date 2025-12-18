# UI Components

The `@nomadprogrammer/likha-ui` package provides reusable UI components for building editor toolbars and menus.

## Toolbar

Create customizable toolbars with buttons, dropdowns, and separators.

```typescript
import { Toolbar } from '@nomadprogrammer/likha-ui';

const toolbar = new Toolbar({
  container: HTMLElement,
  buttons: ButtonConfig[],
  theme?: 'light' | 'dark'
});
```

### Button Config

```typescript
interface ButtonConfig {
  /** Button ID */
  id: string;
  
  /** Button label/icon */
  label: string;
  
  /** Button type */
  type: 'button' | 'dropdown' | 'separator' | 'color-picker';
  
  /** Tooltip text */
  title?: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Check if button is active */
  isActive?: () => boolean;
  
  /** Check if button is disabled */
  isDisabled?: () => boolean;
  
  /** Dropdown options (for type: 'dropdown') */
  options?: DropdownOption[];
  
  /** Icon SVG */
  icon?: string;
}
```

### Example

```typescript
import { Toolbar } from '@nomadprogrammer/likha-ui';
import { Editor } from '@nomadprogrammer/likha-core';

const editor = new Editor({ element: document.getElementById('editor') });

const toolbar = new Toolbar({
  container: document.getElementById('toolbar'),
  buttons: [
    {
      id: 'bold',
      label: 'Bold',
      type: 'button',
      title: 'Bold (Ctrl+B)',
      icon: '<svg>...</svg>',
      onClick: () => editor.executeCommand('bold'),
      isActive: () => editor.isActive('strong')
    },
    {
      id: 'heading',
      label: 'Heading',
      type: 'dropdown',
      title: 'Heading',
      options: [
        { value: '0', label: 'Paragraph' },
        { value: '1', label: 'Heading 1' },
        { value: '2', label: 'Heading 2' }
      ],
      onClick: (value) => {
        if (value === '0') editor.executeCommand('setParagraph');
        else editor.executeCommand('toggleHeading', parseInt(value));
      }
    }
  ]
});
```

## MenuBar

Create menu bars with dropdown menus.

```typescript
import { MenuBar } from '@nomadprogrammer/likha-ui';

const menuBar = new MenuBar({
  container: HTMLElement,
  menus: MenuConfig[]
});
```

### Menu Config

```typescript
interface MenuConfig {
  label: string;
  items: MenuItem[];
}

interface MenuItem {
  label: string;
  shortcut?: string;
  onClick: () => void;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
  separator?: boolean;
}
```

### Example

```typescript
const menuBar = new MenuBar({
  container: document.getElementById('menubar'),
  menus: [
    {
      label: 'Edit',
      items: [
        {
          label: 'Undo',
          shortcut: 'Ctrl+Z',
          onClick: () => editor.executeCommand('undo')
        },
        {
          label: 'Redo',
          shortcut: 'Ctrl+Y',
          onClick: () => editor.executeCommand('redo')
        },
        { separator: true },
        {
          label: 'Cut',
          shortcut: 'Ctrl+X',
          onClick: () => document.execCommand('cut')
        }
      ]
    },
    {
      label: 'Format',
      items: [
        {
          label: 'Bold',
          shortcut: 'Ctrl+B',
          onClick: () => editor.executeCommand('bold'),
          isActive: () => editor.isActive('strong')
        }
      ]
    }
  ]
});
```

## ColorPicker

Pick colors for text and highlights.

```typescript
import { ColorPicker } from '@nomadprogrammer/likha-ui';

const picker = new ColorPicker({
  container: HTMLElement,
  colors: string[],
  onSelect: (color: string) => void,
  defaultColor?: string
});
```

### Example

```typescript
const colorPicker = new ColorPicker({
  container: document.getElementById('color-picker'),
  colors: [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
  ],
  onSelect: (color) => {
    editor.executeCommand('setTextColor', color);
  },
  defaultColor: '#000000'
});
```

## Button

Individual button component.

```typescript
import { Button } from '@nomadprogrammer/likha-ui';

const button = new Button({
  label: string,
  icon?: string,
  title?: string,
  onClick: () => void,
  isActive?: () => boolean,
  isDisabled?: () => boolean
});
```

### Example

```typescript
const boldButton = new Button({
  label: 'Bold',
  icon: '<svg>...</svg>',
  title: 'Bold (Ctrl+B)',
  onClick: () => editor.executeCommand('bold'),
  isActive: () => editor.isActive('strong'),
  isDisabled: () => false
});

document.getElementById('toolbar').appendChild(boldButton.element);
```

## Dropdown

Dropdown select component.

```typescript
import { Dropdown } from '@nomadprogrammer/likha-ui';

const dropdown = new Dropdown({
  options: DropdownOption[],
  onSelect: (value: string) => void,
  defaultValue?: string,
  placeholder?: string
});
```

### Example

```typescript
const headingDropdown = new Dropdown({
  options: [
    { value: '0', label: 'Paragraph' },
    { value: '1', label: 'Heading 1' },
    { value: '2', label: 'Heading 2' },
    { value: '3', label: 'Heading 3' }
  ],
  onSelect: (value) => {
    if (value === '0') {
      editor.executeCommand('setParagraph');
    } else {
      editor.executeCommand('toggleHeading', parseInt(value));
    }
  },
  defaultValue: '0',
  placeholder: 'Select heading...'
});
```

## Theming

All UI components support theming:

```typescript
import { setTheme } from '@nomadprogrammer/likha-ui';

// Set global theme
setTheme('dark');

// Or per component
const toolbar = new Toolbar({
  container: element,
  buttons: [],
  theme: 'dark'
});
```

### Custom Themes

```typescript
import { registerTheme } from '@nomadprogrammer/likha-ui';

registerTheme('custom', {
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  border: '#3e3e3e',
  hover: '#2a2a2a',
  active: '#0e639c',
  disabled: '#6e6e6e'
});

setTheme('custom');
```

## CSS Classes

All components use BEM naming:

```css
/* Toolbar */
.likha-toolbar { }
.likha-toolbar__button { }
.likha-toolbar__button--active { }
.likha-toolbar__button--disabled { }
.likha-toolbar__separator { }

/* Dropdown */
.likha-dropdown { }
.likha-dropdown__toggle { }
.likha-dropdown__menu { }
.likha-dropdown__item { }
.likha-dropdown__item--active { }

/* ColorPicker */
.likha-colorpicker { }
.likha-colorpicker__swatch { }
.likha-colorpicker__swatch--selected { }
```

You can override these classes to customize appearance:

```css
.likha-toolbar {
  background: #f0f0f0;
  padding: 12px;
  border-radius: 8px;
}

.likha-toolbar__button {
  border-radius: 4px;
  padding: 6px 10px;
}

.likha-toolbar__button--active {
  background: #0066cc;
  color: white;
}
```

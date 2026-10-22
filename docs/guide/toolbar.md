# Toolbar

The default toolbar is inserted before the editable area. Pass an existing toolbarContainer to place it elsewhere, or toolbar: false to disable it.

```js
createEditor({
  element: '#editor',
  toolbarButtons: ['heading', 'bold', 'italic', 'link', 'table', 'tableControls', 'find', 'replace']
});
```

## Button names

| Group | Names |
| --- | --- |
| History | undo, redo |
| Formatting | heading, bold, italic, underline, strikethrough, subscript, superscript, clearFormatting |
| Blocks | bulletList, orderedList, blockquote, horizontalRule, codeBlock |
| Alignment | alignLeft, alignCenter, alignRight |
| Media and links | link, image, uploadImage |
| Tables | table, tableControls |
| Appearance | textColor, highlight |
| Source and search | htmlSourceView, find, replace |
| Review | comment, comments |

Upload and comment controls require their corresponding options. Controls for disabled plugins are hidden. A button array selects visibility; the default group order is retained.

## Keyboard use

- Tab moves through toolbar controls. Enter or Space activates buttons.
- Arrow keys navigate style menus and the table insertion picker. Escape closes them.
- Mod+B / Mod+I / Mod+U toggle bold, italic, and underline.
- Mod+Z undoes; Mod+Shift+Z or Mod+Y redoes.
- Mod+K opens the link dialog when text is selected and the toolbar is enabled.
- Tab and Shift+Tab navigate table cells.
- Mod+[ and Mod+] outdent/indent list items.

Mod means Control on Windows/Linux and Command on macOS. Full accessibility conformance is still under review.

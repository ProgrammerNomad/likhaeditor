# Read-only mode

```js
const instance = createEditor({
  element: '#preview',
  content: '<p>Preview content</p>',
  editable: false,
  toolbar: false
});
instance.setEditable(true); // Re-enable user input.
instance.setEditable(false);
instance.destroy();
```

Use the editable option or setEditable method instead of directly modifying contenteditable. Programmatic updates remain available. Try the Read-only switch in the [playground](/playground).

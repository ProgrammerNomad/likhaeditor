# Configuration

This page describes the current development build. See [release status](/status) for published-package limitations.

```js
const instance = createEditor({
  element: '#editor',
  content: '<p>Initial content</p>',
  placeholder: 'Start writing…',
  editable: true,
  toolbar: true,
  toolbarButtons: ['heading', 'bold', 'italic', 'link', 'table', 'tableControls', 'find'],
  darkTheme: false,
  onChange: html => console.log(html)
});
```

| Option | Behavior |
| --- | --- |
| element | Required HTMLElement or CSS selector |
| content | Initial HTML; defaults to an empty paragraph |
| placeholder | Per-editor placeholder text |
| editable | User input enabled by default |
| toolbar | Enabled by default; false hides the toolbar |
| toolbarContainer | Optional existing element or selector; missing targets throw |
| toolbarButtons | Button-name array or 'all'; controls for missing plugins are hidden |
| plugins | Array of built-in plugin names; omitted loads defaults, [] loads none |
| darkTheme | Adds the editor-local dark theme class; load the distributed CSS |
| onChange | Synchronous callback for document changes; selection changes do not invoke it |
| autosave | Optional application-owned persistence adapter |
| imageUpload | Optional application-owned file upload adapter |
| comments | Optional reviewer identity, stored annotations, and metadata callback |
| versions | Optional version snapshot store |

```js
instance.getContent();
instance.setContent('<p>Updated content</p>');
instance.getText();
instance.getJSON();
instance.setEditable(false);
instance.destroy();
```

Read-only mode prevents user input; programmatic commands remain available. Always destroy an instance when its component unmounts. See [professional editing](/guide/professional-editing) for storage adapters, comments, tables, and import/export.

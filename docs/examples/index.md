# Examples

Live examples demonstrating Likha Editor usage.

## Basic Editor

The simplest possible setup.

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">
</head>
<body>
  <div id="editor"></div>

  <script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
  <script>
    const { createEditor } = LikhaEditor;
    
    createEditor({
      element: document.getElementById('editor'),
      content: '<p>Start writing...</p>'
    });
  </script>
</body>
</html>
```

[View Live Demo](/examples/basic)

---

## Custom Toolbar

Choose which buttons appear in the toolbar.

```javascript
import { createEditor } from '@likhaeditor/likhaeditor';

createEditor({
  element: '#editor',
  toolbarContainer: '#toolbar',
  toolbarButtons: [
    'heading',
    'bold',
    'italic',
    'underline',
    'link',
    'bulletList',
    'orderedList',
    'blockquote'
  ],
  content: '<p>Custom toolbar with only essential buttons</p>'
});
```

[View Live Demo](/examples/custom-toolbar)

---

## With Change Handler

Track content changes.

```javascript
const instance = createEditor({
  element: '#editor',
  content: '<p>Type here...</p>',
  onChange: (html) => {
    console.log('Content updated:', html);
    
    // Update preview
    document.getElementById('preview').innerHTML = html;
    
    // Update character count
    const text = html.replace(/<[^>]*>/g, '');
    document.getElementById('count').textContent = text.length;
  }
});
```

[View Live Demo](/examples/with-changes)

---

## Readonly Mode

Display content without editing.

```javascript
const instance = createEditor({
  element: '#editor',
  toolbar: false,  // Disable toolbar
  content: '<p>This content is read-only</p>'
});

// Make editor non-editable
instance.editor.view.dom.setAttribute('contenteditable', 'false');
```

[View Live Demo](/examples/readonly)

---

## Form Integration

Use with HTML forms.

```html
<form id="myForm">
  <div id="editor"></div>
  <input type="hidden" name="content" id="content-input">
  <button type="submit">Submit</button>
</form>

<script>
  const instance = createEditor({
    element: document.getElementById('editor'),
    content: '<p>Form content...</p>',
    onChange: (html) => {
      document.getElementById('content-input').value = html;
    }
  });

  document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Submitting:', formData.get('content'));
  });
</script>
```

[View Live Demo](/examples/forms)

---

## Multiple Editors

Multiple editor instances on one page.

```javascript
const editor1 = createEditor({
  element: '#editor1',
  toolbarContainer: '#toolbar1',
  content: '<p>First editor</p>'
});

const editor2 = createEditor({
  element: '#editor2',
  toolbarContainer: '#toolbar2',
  content: '<p>Second editor</p>'
});
```

[View Live Demo](/examples/multiple)

---

## Dark Theme

Enable dark mode (coming soon).

```javascript
createEditor({
  element: '#editor',
  darkTheme: true,
  content: '<p>Dark mode editor</p>'
});
```

---

## Minimal Setup

Smallest possible editor - formatting only.

```javascript
createEditor({
  element: '#editor',
  toolbarContainer: '#toolbar',
  toolbarButtons: ['bold', 'italic', 'underline'],
  plugins: ['strikethrough', 'subscript', 'superscript'],
  content: '<p>Minimal editor</p>'
});
```

[View Live Demo](/examples/minimal)

---

## All Features

Kitchen sink example with everything enabled.

```javascript
createEditor({
  element: '#editor',
  toolbarContainer: '#toolbar',
  toolbarButtons: 'all',
  content: '<h1>Full Featured Editor</h1><p>Every feature enabled!</p>'
});
```

[View Live Demo](/examples/full)

---

## More Examples

- [React Integration](/guide/react)
- [Laravel Blade](/guide/laravel)
- [Livewire Component](/guide/livewire)
- [Custom Plugins](/guide/custom-plugins)

## CodePen Examples

Try Likha on CodePen:

- [Basic Editor](https://codepen.io/programmernomad/pen/likha-basic)
- [Custom Toolbar](https://codepen.io/programmernomad/pen/likha-toolbar)
- [Form Integration](https://codepen.io/programmernomad/pen/likha-forms)

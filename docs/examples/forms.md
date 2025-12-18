# Form Integration

Use Likha Editor with HTML forms for seamless data submission.

::: tip Live Demo
Copy the code below and save as an HTML file to see a working demo.
:::

## Code

### HTML Structure

```html
<form id="myForm">
  <label for="title">Title</label>
  <input type="text" name="title" id="title" />
  
  <label>Content</label>
  <div id="editor-toolbar"></div>
  <div id="editor"></div>
  <input type="hidden" name="content" id="content-input" />
  
  <button type="submit">Submit</button>
</form>
```

### JavaScript

```javascript
import { createEditor } from '@likhaeditor/likhaeditor';

const instance = createEditor({
  element: document.getElementById('editor'),
  toolbarContainer: document.getElementById('editor-toolbar'),
  content: '<p>Write content here...</p>',
  onChange: (html) => {
    // Update hidden input whenever content changes
    document.getElementById('content-input').value = html;
  }
});

document.getElementById('myForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  // Submit via fetch
  fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: formData.get('title'),
      content: formData.get('content')
    })
  });
});
```

## Validation

### Required Field

```javascript
document.getElementById('myForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const content = instance.getContent();
  const text = content.replace(/<[^>]*>/g, '').trim();
  
  if (text.length === 0) {
    alert('Content is required');
    return;
  }
  
  // Submit form
});
```

### Minimum Length

```javascript
const MIN_LENGTH = 100;

document.getElementById('myForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const content = instance.getContent();
  const text = content.replace(/<[^>]*>/g, '');
  
  if (text.length < MIN_LENGTH) {
    alert(`Content must be at least ${MIN_LENGTH} characters`);
    return;
  }
  
  // Submit form
});
```

### Maximum Length

```javascript
const MAX_LENGTH = 5000;

createEditor({
  element: '#editor',
  onChange: (html) => {
    const text = html.replace(/<[^>]*>/g, '');
    const remaining = MAX_LENGTH - text.length;
    
    document.getElementById('char-count').textContent = 
      `${text.length} / ${MAX_LENGTH} characters`;
    
    if (remaining < 0) {
      document.getElementById('char-count').style.color = 'red';
    } else {
      document.getElementById('char-count').style.color = 'inherit';
    }
    
    document.getElementById('content-input').value = html;
  }
});
```

## Laravel Integration

```blade
<form action="{{ route('posts.store') }}" method="POST">
  @csrf
  
  <x-input-label for="title" value="Title" />
  <x-text-input name="title" id="title" value="{{ old('title') }}" />
  @error('title')
    <span class="error">{{ $message }}</span>
  @enderror
  
  <x-input-label for="content" value="Content" />
  <div id="editor-toolbar"></div>
  <div id="editor"></div>
  <input type="hidden" name="content" id="content" value="{{ old('content') }}" />
  @error('content')
    <span class="error">{{ $message }}</span>
  @enderror
  
  <button type="submit">Publish</button>
</form>

<script type="module">
  import { createEditor } from '@likhaeditor/likhaeditor';
  
  createEditor({
    element: '#editor',
    toolbarContainer: '#editor-toolbar',
    content: @json(old('content', '<p>Write your post...</p>')),
    onChange: (html) => {
      document.getElementById('content').value = html;
    }
  });
</script>
```

See [Laravel Guide](/guide/laravel) for more Laravel-specific examples.

## React Integration

```jsx
import { useRef, useEffect } from 'react';
import { createEditor } from '@likhaeditor/likhaeditor';

function BlogForm() {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);
  
  useEffect(() => {
    instanceRef.current = createEditor({
      element: editorRef.current,
      content: '<p>Write content...</p>'
    });
    
    return () => instanceRef.current?.destroy();
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = instanceRef.current.getContent();
    
    // Submit data
    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div ref={editorRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

See [React Guide](/guide/react) for more React-specific examples.

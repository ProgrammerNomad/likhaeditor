# Laravel Integration

::: warning Coming Soon
The Laravel integration for LikhaEditor is currently under development and will be available in **v0.1.0** (January 2026).
:::

## Planned Features

The `likhaeditor/laravel` package will provide:

- **Blade Components** - `<x-likha-editor>` component
- **Form Integration** - Seamless integration with Laravel forms
- **Validation Rules** - Built-in validation for editor content
- **File Uploads** - Laravel-native file upload handling
- **Asset Publishing** - Easy CSS/JS asset management

## Preview Usage

### Blade Component

```blade
<x-likha-editor 
    name="content" 
    :value="old('content', $post->content)"
    placeholder="Start writing your post..."
/>
```

### With Validation

```php
// Controller
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|max:255',
        'content' => 'required|likha_content',
    ]);

    Post::create($validated);
}
```

### Custom Toolbar

```blade
<x-likha-editor 
    name="content"
    :toolbar="['bold', 'italic', 'link', 'heading']"
    :plugins="['heading', 'link', 'bulletList']"
/>
```

## Configuration

```php
// config/likhaeditor.php

return [
    'default_plugins' => [
        'heading',
        'bulletList',
        'orderedList',
        'blockquote',
        'link',
        'image',
    ],
    
    'upload' => [
        'disk' => 'public',
        'path' => 'editor-uploads',
        'max_size' => 5120, // KB
    ],
    
    'content_security' => [
        'allowed_tags' => ['p', 'h1', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li'],
        'sanitize' => true,
    ],
];
```

## Image Upload Route

```php
// Automatic route registration
// POST /likhaeditor/upload

use LikhaEditor\Http\Controllers\UploadController;

Route::post('/likhaeditor/upload', [UploadController::class, 'handle'])
    ->middleware('auth');
```

## Content Sanitization

```php
use LikhaEditor\Facades\LikhaEditor;

$clean = LikhaEditor::sanitize($request->input('content'));
```

## Current Workaround

While the Laravel package is in development, you can use the CDN version:

```blade
{{-- resources/views/posts/edit.blade.php --}}

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">
</head>
<body>
    <form action="{{ route('posts.update', $post) }}" method="POST">
        @csrf
        @method('PUT')
        
        <div id="toolbar-container"></div>
        <div id="editor"></div>
        
        <input type="hidden" name="content" id="content-input">
        
        <button type="submit">Save</button>
    </form>

    <script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
    <script>
        const { editor } = LikhaEditor.createEditor({
            element: document.getElementById('editor'),
            content: {!! json_encode(old('content', $post->content)) !!},
            toolbar: true,
            toolbarContainer: '#toolbar-container',
            onChange: (html) => {
                document.getElementById('content-input').value = html;
            }
        });
    </script>
</body>
</html>
```

## Installation (When Available)

```bash
composer require likhaeditor/laravel
```

```bash
php artisan vendor:publish --provider="LikhaEditor\LikhaEditorServiceProvider"
```

## Get Notified

Want to be notified when the Laravel package is released?

- ⭐ [Star the repo](https://github.com/ProgrammerNomad/likhaeditor) on GitHub
- 👀 [Watch releases](https://github.com/ProgrammerNomad/likhaeditor/releases)
- 💬 [Join discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)

## Contributing

Interested in helping build the Laravel integration? Check out:

- [GitHub Issues](https://github.com/ProgrammerNomad/likhaeditor/issues) - See what needs to be done
- [Contributing Guide](/guide/contributing) - Learn how to contribute
- [Roadmap](https://github.com/ProgrammerNomad/likhaeditor#roadmap-to-version-10) - Development timeline

## Timeline

- **v0.1.0** (January 2026) - Initial Laravel package release
- **v0.2.0** (February 2026) - File upload and image handling
- **v0.3.0** (March 2026) - Advanced validation and content security
- **v0.4.0** (April 2026) - Laravel Livewire integration

## Livewire Support

Looking for Livewire integration? See [Livewire Integration](/guide/livewire) (also coming soon).

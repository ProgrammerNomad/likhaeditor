# Livewire Integration

::: warning Coming Soon
The Livewire integration for LikhaEditor is currently under development and will be available in **v0.2.0** (February 2026).
:::

## Planned Features

The `likhaeditor/livewire` package will provide:

- **Livewire Component** - Drop-in `<livewire:likha-editor>` component
- **Wire:model Support** - Two-way data binding with `wire:model`
- **Real-time Updates** - Automatic synchronization
- **File Uploads** - Native Livewire file upload integration
- **Validation** - Seamless Livewire validation

## Preview Usage

### Basic Component

```blade
<livewire:likha-editor 
    wire:model.defer="content"
    placeholder="Start writing..."
/>
```

### In a Livewire Component

```php
<?php

namespace App\Http\Livewire;

use Livewire\Component;

class PostEditor extends Component
{
    public $content = '<p>Initial content</p>';

    protected $rules = [
        'content' => 'required|min:10',
    ];

    public function save()
    {
        $this->validate();
        
        // Save content
    }

    public function render()
    {
        return view('livewire.post-editor');
    }
}
```

```blade
{{-- resources/views/livewire/post-editor.blade.php --}}

<div>
    <livewire:likha-editor wire:model.defer="content" />
    
    @error('content')
        <span class="error">{{ $message }}</span>
    @enderror
    
    <button wire:click="save">Save</button>
</div>
```

### With File Uploads

```php
use Livewire\WithFileUploads;

class PostEditor extends Component
{
    use WithFileUploads;
    
    public $content;
    public $uploads = [];

    public function handleUpload($file)
    {
        $path = $file->store('editor-uploads', 'public');
        $url = Storage::url($path);
        
        $this->emit('imageUploaded', $url);
        
        return $url;
    }
}
```

### Real-time Mode

```blade
{{-- Updates on every keystroke --}}
<livewire:likha-editor wire:model="content" />

{{-- Updates on blur/save --}}
<livewire:likha-editor wire:model.defer="content" />

{{-- Debounced updates --}}
<livewire:likha-editor wire:model.debounce.500ms="content" />
```

## Configuration

```php
// config/likhaeditor-livewire.php

return [
    'wire_model' => [
        'default_modifier' => 'defer', // defer, lazy, debounce
        'debounce_ms' => 500,
    ],
    
    'uploads' => [
        'enabled' => true,
        'disk' => 'public',
        'path' => 'livewire-uploads',
        'max_size' => 5120,
    ],
];
```

## Current Workaround

While the Livewire package is in development, you can use Alpine.js with wire:model:

```blade
<div x-data="{ 
    content: @entangle('content').defer,
    editor: null 
}" x-init="
    const { editor: editorInstance } = LikhaEditor.createEditor({
        element: $refs.editor,
        content: content,
        toolbar: true,
        toolbarContainer: $refs.toolbar,
        onChange: (html) => {
            content = html;
        }
    });
    editor = editorInstance;
">
    <div x-ref="toolbar"></div>
    <div x-ref="editor"></div>
</div>

@push('scripts')
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">
<script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
@endpush
```

## Installation (When Available)

```bash
composer require likhaeditor/livewire
```

```bash
php artisan livewire:publish --config
```

## Get Notified

Want to be notified when the Livewire package is released?

- ⭐ [Star the repo](https://github.com/ProgrammerNomad/likhaeditor) on GitHub
- 👀 [Watch releases](https://github.com/ProgrammerNomad/likhaeditor/releases)
- 💬 [Join discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)

## Contributing

Interested in helping build the Livewire integration? Check out:

- [GitHub Issues](https://github.com/ProgrammerNomad/likhaeditor/issues)
- [Contributing Guide](/guide/contributing)
- [Roadmap](https://github.com/ProgrammerNomad/likhaeditor#roadmap-to-version-10)

## Timeline

- **v0.2.0** (February 2026) - Initial Livewire component release
- **v0.3.0** (March 2026) - File upload integration
- **v0.4.0** (April 2026) - Real-time collaboration features

## Related

- [Laravel Integration](/guide/laravel) - Base Laravel package
- [Installation Guide](/guide/installation) - General installation instructions

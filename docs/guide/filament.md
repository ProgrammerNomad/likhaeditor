# Filament Integration

::: warning Coming Soon
The Filament integration for LikhaEditor is currently under development and will be available in **v0.3.0** (March 2025).
:::

## Planned Features

The `likhaeditor/filament` package will provide:

- **Filament Form Field** - Native `LikhaEditor::make()` form component
- **Table Column** - Display rich text in Filament tables
- **Infolist Entry** - Show formatted content in infolists
- **Resource Integration** - Seamless CRUD operations
- **File Uploads** - Native Filament file upload integration
- **Theme Support** - Matches Filament's light/dark themes

## Preview Usage

### Form Field

```php
use LikhaEditor\Forms\Components\LikhaEditor;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            TextInput::make('title')
                ->required(),
            
            LikhaEditor::make('content')
                ->required()
                ->placeholder('Start writing your post...')
                ->toolbar(['bold', 'italic', 'link', 'heading', 'bulletList'])
                ->plugins(['heading', 'link', 'bulletList', 'image'])
                ->maxLength(10000),
        ]);
}
```

### With File Uploads

```php
LikhaEditor::make('content')
    ->fileAttachmentsDisk('public')
    ->fileAttachmentsDirectory('editor-uploads')
    ->fileAttachmentsVisibility('public')
    ->imageUpload()
    ->imageResize(1024)
    ->imageQuality(80)
```

### Advanced Configuration

```php
LikhaEditor::make('content')
    ->toolbar([
        'undo',
        'redo',
        '|',
        'bold',
        'italic',
        'underline',
        'strike',
        '|',
        'heading',
        'bulletList',
        'orderedList',
        '|',
        'link',
        'image',
        'table',
        '|',
        'alignLeft',
        'alignCenter',
        'alignRight',
    ])
    ->plugins([
        'heading',
        'bulletList',
        'orderedList',
        'link',
        'image',
        'table',
        'textAlignment',
        'codeBlock',
    ])
    ->characterLimit(5000)
    ->wordLimit(1000)
    ->required()
```

### Table Column

```php
use LikhaEditor\Tables\Columns\LikhaEditorColumn;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('title'),
            
            LikhaEditorColumn::make('content')
                ->limit(100)
                ->stripTags()
                ->searchable()
                ->sortable(),
            
            TextColumn::make('created_at')
                ->dateTime(),
        ]);
}
```

### Infolist Entry

```php
use LikhaEditor\Infolists\Components\LikhaEditorEntry;

public static function infolist(Infolist $infolist): Infolist
{
    return $infolist
        ->schema([
            TextEntry::make('title'),
            
            LikhaEditorEntry::make('content')
                ->prose() // Apply Tailwind Typography
                ->columnSpanFull(),
        ]);
}
```

## Validation

```php
LikhaEditor::make('content')
    ->required()
    ->minLength(50)
    ->maxLength(10000)
    ->rules([
        'required',
        'string',
        function ($attribute, $value, $fail) {
            // Custom validation
            if (str_word_count(strip_tags($value)) < 10) {
                $fail('The content must contain at least 10 words.');
            }
        },
    ])
```

## Dark Mode Support

```php
// Automatically adapts to Filament's theme
LikhaEditor::make('content')
    ->darkMode() // Force dark mode
    ->lightMode() // Force light mode
    // Or let it auto-detect (default)
```

## Current Workaround

While the Filament package is in development, you can use a custom form component:

```php
<?php

namespace App\Forms\Components;

use Filament\Forms\Components\Field;

class LikhaEditorField extends Field
{
    protected string $view = 'forms.components.likha-editor-field';
    
    protected array $toolbar = [];
    protected array $plugins = [];
    
    public function toolbar(array $toolbar): static
    {
        $this->toolbar = $toolbar;
        return $this;
    }
    
    public function plugins(array $plugins): static
    {
        $this->plugins = $plugins;
        return $this;
    }
    
    public function getToolbar(): array
    {
        return $this->toolbar;
    }
    
    public function getPlugins(): array
    {
        return $this->plugins;
    }
}
```

```blade
{{-- resources/views/forms/components/likha-editor-field.blade.php --}}

<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div x-data="{ 
        state: $wire.entangle('{{ $getStatePath() }}'),
        editor: null
    }" x-init="
        $nextTick(() => {
            const { editor: editorInstance } = LikhaEditor.createEditor({
                element: $refs.editor,
                content: state,
                toolbar: true,
                toolbarContainer: $refs.toolbar,
                onChange: (html) => {
                    state = html;
                }
            });
            editor = editorInstance;
        })
    " wire:ignore>
        <div x-ref="toolbar" class="rounded-t-lg border border-gray-300 dark:border-gray-600"></div>
        <div x-ref="editor" class="min-h-[200px] rounded-b-lg border-x border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"></div>
    </div>
</x-dynamic-component>

@once
    @push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">
    @endpush
    
    @push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
    @endpush
@endonce
```

Then use it in your resource:

```php
use App\Forms\Components\LikhaEditorField;

LikhaEditorField::make('content')
    ->required()
    ->columnSpanFull()
```

## Installation (When Available)

```bash
composer require likhaeditor/filament
```

```bash
php artisan vendor:publish --tag="likhaeditor-filament-config"
```

## Configuration

```php
// config/likhaeditor-filament.php

return [
    'default_toolbar' => [
        'undo', 'redo', '|',
        'bold', 'italic', 'underline', '|',
        'heading', 'bulletList', 'orderedList', '|',
        'link', 'image',
    ],
    
    'default_plugins' => [
        'heading',
        'bulletList',
        'orderedList',
        'link',
        'image',
        'blockquote',
    ],
    
    'uploads' => [
        'disk' => 'public',
        'directory' => 'editor-uploads',
        'visibility' => 'public',
        'max_size' => 5120, // KB
    ],
    
    'theme' => [
        'auto_detect_dark_mode' => true,
    ],
];
```

## Get Notified

Want to be notified when the Filament package is released?

- ⭐ [Star the repo](https://github.com/ProgrammerNomad/likhaeditor) on GitHub
- 👀 [Watch releases](https://github.com/ProgrammerNomad/likhaeditor/releases)
- 💬 [Join discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)

## Contributing

Interested in helping build the Filament integration? Check out:

- [GitHub Issues](https://github.com/ProgrammerNomad/likhaeditor/issues)
- [Contributing Guide](/guide/contributing)
- [Roadmap](https://github.com/ProgrammerNomad/likhaeditor#roadmap-to-version-10)

## Timeline

- **v0.3.0** (March 2025) - Initial Filament form field
- **v0.4.0** (April 2025) - Table column and infolist entry
- **v0.5.0** (May 2025) - Advanced file upload integration
- **v0.6.0** (June 2025) - Custom toolbar builder and theme support

## Related

- [Laravel Integration](/guide/laravel) - Base Laravel package
- [Livewire Integration](/guide/livewire) - Livewire components
- [Installation Guide](/guide/installation) - General installation

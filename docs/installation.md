# Installation

## Prerequisites

- Node.js 18+ (for development)
- Modern browser (Chrome, Firefox, Safari, Edge)

## Package Manager

Likha uses **pnpm** for package management. Install it globally:

```bash
npm install -g pnpm
```

## Vanilla JavaScript / HTML

### Via CDN (Recommended for Prototyping)

```html
<script src="https://unpkg.com/@likha/html@latest/dist/likha-editor.umd.js"></script>
<script>
  const { createEditor } = LikhaEditor;
  // Use createEditor...
</script>
```

### Via npm/pnpm

```bash
pnpm add @likha/html
```

```javascript
import { createEditor } from '@likha/html';
```

## React (Coming Soon)

```bash
pnpm add @likha/react
```

```jsx
import { LikhaEditor } from '@likha/react';

function MyComponent() {
  const [content, setContent] = useState('<p>Hello</p>');
  
  return (
    <LikhaEditor
      content={content}
      onChange={setContent}
      placeholder="Start typing..."
    />
  );
}
```

## Laravel (Coming Soon)

### 1. Install via Composer

```bash
composer require likha/laravel
```

### 2. Publish Assets

```bash
php artisan vendor:publish --tag=likha-assets
```

### 3. Use Blade Component

```blade
<x-likha-editor
    name="content"
    :value="$post->content"
    placeholder="Write your post..."
/>
```

## Livewire (Coming Soon)

### 1. Install Package

```bash
composer require likha/livewire
```

### 2. Use in Livewire Component

```blade
<livewire:likha-editor
    wire:model="post.content"
    placeholder="Write your post..."
/>
```

```php
class EditPost extends Component
{
    public Post $post;
    
    public function save()
    {
        $this->post->save();
    }
}
```

## Development Installation

Clone and build from source:

```bash
# Clone repository
git clone https://github.com/yourusername/likha.git
cd likha

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run dev server with examples
pnpm dev
```

## Bundle Sizes

| Package | Size (gzipped) |
|---------|----------------|
| @likha/core | ~3.3 KB |
| @likha/plugins | ~25 KB |
| @likha/html (UMD) | ~85 KB |

## Browser Compatibility

- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions
- **Mobile:** iOS Safari 14+, Chrome Android latest

No IE11 support (uses modern ES6+ features).

## Next Steps

- [Getting Started Guide](./getting-started.md)
- [API Reference](./api/README.md)
- [Configuration Options](./configuration.md)

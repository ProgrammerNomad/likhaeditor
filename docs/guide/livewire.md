# Livewire integration

Requires `likha/laravel` assets to be published.

```bash
composer require likha/laravel likha/livewire
php artisan vendor:publish --tag=likha-assets
```

Register the component in a Livewire 3 app (auto-discovered via the package service provider):

```blade
<livewire:likha-editor wire:model="post.content" placeholder="Write your post..." />
```

The editor mounts inside `wire:ignore` and pushes HTML back through `Livewire.find(id).set('content', html)`.

See [Laravel integration](/guide/laravel) and [configuration](/guide/configuration).

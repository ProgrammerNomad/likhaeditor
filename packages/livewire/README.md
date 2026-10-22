# likha/livewire

Livewire 3 component wrapping the Likha Blade integration.

## Install

```bash
composer require likha/laravel likha/livewire
php artisan vendor:publish --tag=likha-assets
```

## Usage

```blade
<livewire:likha-editor wire:model="post.content" />
```

Ensure `public/vendor/likha` contains the built UMD bundle and CSS from `@likhaeditor/likhaeditor`.

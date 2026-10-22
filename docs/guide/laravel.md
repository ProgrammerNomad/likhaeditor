# Laravel integration

## Composer package

```bash
composer require likha/laravel
php artisan vendor:publish --tag=likha-assets
```

Copy `likha-editor.umd.js` and `likha-editor.css` from `@likhaeditor/likhaeditor` into `public/vendor/likha/` (or publish after copying into `packages/laravel/resources/assets` when developing this monorepo).

## Blade component

```blade
<x-likha-editor
    name="content"
    :value="$post->content"
    placeholder="Write your post..."
/>
```

The component syncs HTML into a hidden textarea for standard form posts. Sanitize and validate on the server. Uploads use your own endpoint via the [upload callback](/guide/professional-editing).

Configuration keys live in `config/likha.php` (`script`, `stylesheet` asset paths).

See [self-hosting](/guide/self-hosting) for CDN-free deployment.

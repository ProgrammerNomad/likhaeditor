# likha/laravel

Blade component and asset publishing for self-hosted Likha Editor builds.

## Install

```bash
composer require likha/laravel
php artisan vendor:publish --tag=likha-assets
```

Copy built `likha-editor.umd.js` and `likha-editor.css` from `@likhaeditor/likhaeditor` into `public/vendor/likha/` before publishing assets, or replace the files after publish.

## Usage

```blade
<x-likha-editor name="content" :value="$post->content" placeholder="Write your post..." />
```

Sanitize and validate HTML on the server. Uploads and autosave remain application-owned.

<?php

namespace Likha\Laravel;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class LikhaEditorServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/likha.php', 'likha');
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__ . '/../resources/assets' => public_path('vendor/likha'),
        ], 'likha-assets');

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'likha');

        Blade::component('likha::components.likha-editor', 'likha-editor');
    }
}

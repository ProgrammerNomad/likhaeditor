<?php

namespace Likha\Livewire;

use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;

class LikhaLivewireServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'likha-livewire');
        Livewire::component('likha-editor', LikhaEditor::class);
    }
}

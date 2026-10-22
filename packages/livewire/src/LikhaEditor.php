<?php

namespace Likha\Livewire;

use Livewire\Component;

class LikhaEditor extends Component
{
    public string $content = '';
    public string $placeholder = 'Start writing...';
    public bool $toolbar = true;

    public function render()
    {
        return view('likha-livewire::likha-editor');
    }
}

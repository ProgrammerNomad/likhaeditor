# Filament integration

A dedicated Filament field is planned and is not published in this repository. There is currently no supported `LikhaEditor::make()` PHP API.

You can build a custom field around the [vanilla adapter](/guide/configuration), using a DOM container excluded from Livewire reconciliation, forwarding HTML changes to field state, and destroying the editor on unmount. This requires application-specific lifecycle and validation work; it has not yet been verified as a packaged Filament integration.

For an integration available today, use the [plain Blade form example](/guide/laravel). The [release status](/status) distinguishes working editor capabilities from planned framework adapters.

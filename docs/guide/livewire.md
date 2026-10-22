# Livewire integration

A dedicated Livewire adapter is planned. The current supported building block is the vanilla `createEditor` API; there is no shipped `wire:model` editor component.

For a manual integration, give Livewire a `wire:ignore` editor container, initialize the editor after that container mounts, and forward `onChange(html)` to your component's state using the API supported by your Livewire version. Debounce network persistence outside the editor. Call `destroy()` before the container is removed or navigation replaces it.

Do not let DOM reconciliation replace ProseMirror's editable children while an instance is mounted. External document loads should use `instance.setContent(html)` explicitly, with a guard against echoing the same update back to the server.

See the [Blade form example](/guide/laravel), [configuration](/guide/configuration), and [autosave callback](/guide/professional-editing). A version-specific Livewire lifecycle example remains to be validated before a dedicated adapter release.

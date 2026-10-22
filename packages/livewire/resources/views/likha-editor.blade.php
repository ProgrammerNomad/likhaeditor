<div wire:ignore>
  <link rel="stylesheet" href="{{ asset(config('likha.stylesheet')) }}">
  <textarea id="likha-livewire-field-{{ $this->getId() }}" hidden>{{ $content }}</textarea>
  <div id="likha-livewire-editor-{{ $this->getId() }}"></div>
  <script src="{{ asset(config('likha.script')) }}"></script>
  <script>
    (function () {
      const componentId = @json($this->getId());
      const field = document.getElementById('likha-livewire-field-' + componentId);
      const instance = LikhaEditor.createEditor({
        element: '#likha-livewire-editor-' + componentId,
        content: field.value,
        placeholder: @json($placeholder),
        toolbar: @json($toolbar),
        onChange: (html) => {
          field.value = html;
          const component = window.Livewire?.find(componentId);
          component?.set('content', html);
        },
      });
      window.addEventListener('pagehide', () => instance.destroy());
    })();
  </script>
</div>

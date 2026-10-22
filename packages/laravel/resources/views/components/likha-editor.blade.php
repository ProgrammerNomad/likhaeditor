@props([
    'name' => 'content',
    'value' => '',
    'placeholder' => 'Start writing...',
    'toolbar' => true,
])

<link rel="stylesheet" href="{{ asset(config('likha.stylesheet')) }}">
<textarea name="{{ $name }}" id="{{ $name }}-field" hidden>{{ old($name, $value) }}</textarea>
<div id="{{ $name }}-editor" {{ $attributes->class(['likha-editor-host']) }}></div>
<script src="{{ asset(config('likha.script')) }}"></script>
<script>
  (function () {
    const field = document.getElementById(@json($name . '-field'));
    const instance = LikhaEditor.createEditor({
      element: @json('#' . $name . '-editor'),
      content: field.value,
      placeholder: @json($placeholder),
      toolbar: @json($toolbar),
      onChange: (html) => { field.value = html; },
    });
    window.addEventListener('pagehide', () => instance.destroy());
  })();
</script>

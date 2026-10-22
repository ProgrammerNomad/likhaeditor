# Laravel integration

Use the standalone browser build in Blade or import the vanilla adapter through your asset build. A dedicated Composer package and Blade component are planned, not shipped.

Copy the built JavaScript and CSS to your public assets directory as described in [self-hosting](/guide/self-hosting). A normal form can submit a hidden field:

```blade
<link rel="stylesheet" href="/assets/likha-editor.css">
<form method="POST" action="{{ route('posts.store') }}" id="post-form">
  @csrf
  <textarea name="content" id="post-content" hidden>{{ old('content', '') }}</textarea>
  <div id="editor"></div>
  <button type="submit">Save</button>
</form>
<script src="/assets/likha-editor.umd.js"></script>
<script>
  const field = document.querySelector('#post-content');
  const instance = LikhaEditor.createEditor({
    element: '#editor',
    content: field.value,
    onChange: html => { field.value = html; },
  });
</script>
```

The server must authorize writes, validate length and allowed content, and sanitize stored HTML before rendering it. Editor URL/schema checks do not replace server validation. Uploads use your own authenticated endpoint through the [upload callback](/guide/professional-editing).

# Installation

Learn how to install and set up LikhaEditor in your project.

## Package Manager

Install via npm, pnpm, or yarn:

::: code-group

```bash [npm]
npm install @likhaeditor/likhaeditor
```

```bash [pnpm]
pnpm add @likhaeditor/likhaeditor
```

```bash [yarn]
yarn add @likhaeditor/likhaeditor
```

:::

## CDN

For quick prototyping or simple projects, use the CDN:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor/dist/likha-editor.umd.js"></script>
```

Then initialize the editor:

```html
<div id="editor"></div>

<script>
  const editor = LikhaEditor.createEditor({
    element: document.getElementById('editor'),
    content: '<p>Start writing...</p>'
  });
</script>
```

## Framework integration (0.0.3)

Install the main wrapper from npm:

```bash
npm install @likhaeditor/likhaeditor@0.0.3
```

Framework-specific packages are available:

- [React](/guide/react) — `@likhaeditor/likhaeditor-react`
- [Laravel](/guide/laravel) — `likha/laravel` (Composer)
- [Livewire](/guide/livewire) — `likha/livewire` (Composer)

The [playground](/playground) and this site can use the repository build for previews. See [self-hosting](/guide/self-hosting) to run from source.

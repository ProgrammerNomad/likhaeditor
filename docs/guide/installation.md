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

## Current source and framework integration

The website demo uses a local build; newly added features may not yet be in npm. See [self-hosting](/guide/self-hosting) to build the current source.

Official framework-specific packages remain planned. Use the vanilla adapter inside your framework lifecycle today. See [React](/guide/react), [Laravel](/guide/laravel), and [Livewire](/guide/livewire).

<img src="./assets/logo.svg" alt="LikhaEditor logo" width="100">

# LikhaEditor

A free, MIT-licensed rich text editor built on ProseMirror. Self-host the JavaScript and CSS or serve a pinned release from a CDN. No account, license key, mandatory cloud API, or paid feature tier.

**Pre-1.0 development:** this checkout includes features that are not yet published to npm. See [production readiness](PRODUCTION-READINESS.md) for verified checks and remaining release work. The repository owner handles publishing.

[Documentation](https://likhaeditor.netlify.app/) · [Playground](https://likhaeditor.netlify.app/playground) · [Release status](https://likhaeditor.netlify.app/status)

## Build and self-host

Use Node 22.12+ and pnpm 8.12.0:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm pre-publish
pnpm test:packages
```

Copy `packages/html/dist/likha-editor.umd.js` and `likha-editor.css` to your static assets:

```html
<link rel="stylesheet" href="/assets/likha-editor.css">
<div id="editor"></div>
<script src="/assets/likha-editor.umd.js"></script>
<script>
  const instance = LikhaEditor.createEditor({
    element: '#editor',
    content: '<p>Start writing...</p>',
    onChange: html => console.log(html)
  });
  // Call instance.destroy() when unmounting.
</script>
```

For a published version, the equivalent npm entry point is:

```js
import { createEditor } from '@likhaeditor/likhaeditor';
import '@likhaeditor/likhaeditor/dist/likha-editor.css';
```

Pin the exact released version in production, including CDN URLs. New local features are unavailable from public CDN/npm until a release is published.

## Implemented in this checkout

- Paragraphs, headings, lists, blockquotes, code blocks, links, images, and horizontal rules.
- Inline formatting, text color/highlight, alignment, undo/redo, source editing, and read-only mode.
- Table insertion, row/column operations, headers, cell merge/split, and keyboard navigation.
- Literal find/replace, validated document JSON, and CommonMark import/export for supported nodes.
- Autosave callback with coalescing, flush, and cancellation.
- Application-owned image upload callback, paste/drop hooks, and client MIME/size limits.
- Optional range comments with resolve/reopen/delete and explicit version snapshots with persistence adapters.
- Standalone browser bundle, TypeScript declarations, configurable toolbar, and plugin APIs.

Comments are separate metadata; snapshots currently contain only the document. Deleted comment ranges become orphaned. Markdown cannot preserve every HTML feature. Upload security, content validation, authentication, and storage belong to the host application.

Tracked changes, real-time collaboration, media crop/resize UI, syntax highlighting, dedicated framework adapters, and formal accessibility certification remain future work. This is not a claim of complete parity with established commercial editors. See [the broader wishlist](ROADMAP.md).

## Packages

| Directory | Package | Purpose |
| --- | --- | --- |
| packages/core | @likhaeditor/core | Editor engine and schema |
| packages/ui | @likhaeditor/ui | Toolbar and menus |
| packages/plugins | @likhaeditor/plugins | Official plugins |
| packages/html | @likhaeditor/likhaeditor | Vanilla adapter and standalone bundle |

React can mount the vanilla adapter in an effect and destroy it on cleanup. Blade can use the standalone build and a form field. Dedicated React, Laravel, Livewire, and Filament packages are not shipped.

## Verification and website

```sh
pnpm pre-publish
pnpm exec playwright install chromium firefox webkit
pnpm test:browser
pnpm docs:build
pnpm test:site
pnpm audit
```

The website builds the workspace editor into its interactive playground, so an npm release is not needed to preview or deploy repository changes. Netlify runs the package build before the documentation build. Run `pnpm docs:preview` for a local preview.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md). Report reproducible bugs in [GitHub issues](https://github.com/ProgrammerNomad/likhaeditor/issues).

MIT licensed, free for personal and commercial use. Retain the copyright and license notice when redistributing. Built by [Shiv Singh](https://github.com/ProgrammerNomad) and contributors, using [ProseMirror](https://prosemirror.net/).

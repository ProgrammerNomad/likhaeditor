# Self-hosting and releases

## Build the current source

Use Node 22.12 or newer (CI uses Node 24) and pnpm 8.12.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm pre-publish
pnpm exec playwright install chromium firefox webkit
pnpm test:browser
```

Copy `packages/html/dist/likha-editor.umd.js` and `packages/html/dist/likha-editor.css` to your static assets directory.

```html
<link rel="stylesheet" href="/assets/likha-editor.css">
<div id="editor"></div>
<script src="/assets/likha-editor.umd.js"></script>
<script>
  const instance = LikhaEditor.createEditor({
    element: '#editor', content: '<p>Hello from your server.</p>'
  });
</script>
```

The standalone bundle includes the editing dependencies. No runtime CDN fetch is required when you serve these files yourself. Retain the MIT copyright/license notice with redistribution.

## CDN delivery

After publishing a release, a CDN can serve the same two package files. Pin the version instead of silently loading future releases:

```html
<!-- Replace VERSION with a published version that includes the APIs you need. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor@VERSION/dist/likha-editor.css">
<script src="https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor@VERSION/dist/likha-editor.umd.js"></script>
```

The current website playground is built from local package output, so npm publishing is not required to update it.

## Documentation website

```sh
pnpm build
pnpm docs:build
pnpm docs:preview
```

Netlify uses the repository's `netlify.toml`, Node 24, and a frozen lockfile. It builds the packages before the website so the playground demonstrates the same source revision. The maintainer controls GitHub pushes and npm releases.

## Before a public package release

Choose a new version for changed packages, synchronize internal dependency ranges, run all checks, inspect packed artifacts, and verify examples against that version. A green development milestone is not a declaration that every roadmap feature is complete. Review [status](/status) and the repository's `PRODUCTION-READINESS.md` first.

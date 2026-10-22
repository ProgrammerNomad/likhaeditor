# Production readiness

LikhaEditor is a pre-1.0 editor. This file records verified milestones and release
blockers; the broader ROADMAP.md is a wishlist, not a list of shipped features.

## Product commitments

- All editor features remain MIT licensed and free, including commercial use.
- No mandatory accounts, license keys, subscriptions, telemetry, or hosted APIs.
- Distribute a standalone browser bundle and CSS for self-hosting or a CDN.
- Any future collaboration or upload backend must support self-hosting.
- Work stays on `main`. The project owner handles GitHub pushes.

## Milestone 1: foundation and distribution hardening

- Build all four workspace packages, including HTML adapter declarations and CSS exports.
- Run tests from Windows junction paths, and resolve workspace sources during tests.
- Fail pre-publish validation when tests fail or declared export files are missing.
- Fix nested lists, indentation shortcut, underline shortcut, Shift-Mod-Z redo,
  cursor formatting state, and plain-text block separation.
- Preserve undo history and notify on document changes when setting content.
- Mount the default toolbar and honor `toolbarButtons`.
- Clean up toolbar timers, outside-click listeners, color pickers, source textarea,
  and plugin lifecycle resources through the wrapper's `destroy()`.
- Add read-only editing controls and basic accessible names/state attributes.
- Preserve whitespace when switching between HTML source and visual editing.
- Reject unsafe link/image URL schemes during HTML parsing, serialization, and commands.
- Update dependencies, including the ProseMirror paste security fix and build/test tools.

Validation commands: `pnpm build`, `pnpm test`, `pnpm typecheck`,
`pnpm docs:build`, `pnpm pre-publish`, `pnpm audit`.
Development now requires Node 22.12+; Node 24 is used for this milestone.

Local results on 2026-10-21: 295 tests pass across 20 files; all four packages
build and typecheck; declared export files exist; ESM, CommonJS, and standalone
UMD smoke checks pass. The full dependency audit reports zero advisories. CI is
configured for Windows/Linux but has not run remotely because nothing was pushed.
The documentation build also passes. Lint remains failing with 138 errors,
mostly existing explicit `any` types; its rules have not been relaxed to hide them.

API behavior change: `onChange` runs synchronously for actual document changes,
including `setContent` and undo, rather than debouncing every transaction by 300ms.
Consumers can debounce persistence themselves. Read-only mode prevents user input;
programmatic commands remain available. URL policy allows HTTP(S), relative links,
fragments, mailto/tel links, and HTTP(S)/relative/blob images. Data URLs are rejected.

## Milestone 2: professional editing and website (local, unreleased)

- Strict lint passes without weakening the rules; plugin commands and UI use typed editor APIs.
- Link/image dialogs replace browser prompts; dropdowns and table grids have keyboard navigation.
- Placeholder/count lifecycle, read-only controls, plugin-aware toolbar visibility, and dark-theme hooks improved.
- Tables support row/column operations, merge/split, headers, selection, and keyboard navigation.
- Added literal find/replace, validated JSON, and CommonMark subset import/export.
- Added application-owned autosave and upload callbacks, optional range comments, and explicit version snapshots.
- Standalone bundle tests run in Chromium, Firefox, and WebKit.
- Website preserves the original VitePress homepage design, updates its content, and adds a separate editor playground, current API guides, self-hosting instructions, and release status.
- Broken documentation links now fail the build. Netlify builds workspace packages first and uses Node 24.
- Removed speculative install commands for unshipped framework packages.
- Packed all four packages and installed them in a clean npm consumer outside the workspace. ESM/CommonJS/CSS resolution, included licenses, and strict NodeNext declaration compilation pass. Fixed missing relative extensions in generated declarations.

Verified locally: 305 unit tests across 25 files, 33 editor browser checks across
three browser engines, and 4 website checks across desktop Chromium and mobile
WebKit. Package builds, typechecking, lint, export/ESM/CommonJS/UMD smoke checks,
documentation build, and dependency audit pass. Audit reports no known vulnerabilities.
The website checks cover editing, export, read-only/reset controls, page loads,
and horizontal overflow. CI includes both browser suites; remote results depend
on the owner's next push.

Comments remain separate metadata; deleting a range orphans its anchor and undo
does not revive it. Version snapshots contain only document JSON. Markdown is a
supported subset and rejects unsupported nodes/marks. Uploads need the host app's
authorization, server validation, and storage. The toolbar provides no crop/resize UI.

No npm release is needed for the website: its playground bundles this checkout's
editor. Publish updated packages only after remaining release validation; public
CDN consumers cannot use unpublished changes. The owner performs GitHub pushes
and npm publication. Current package versions still read 0.0.2.

## Remaining release work

1. Verify bundled third-party license notices and measure large-document performance.
2. Test real IME composition, native clipboard formats, touch devices, screen
   readers, and keyboard-only workflows comprehensively. Automated browser tests
   do not establish WCAG compliance.
3. Add tracked changes with acceptance/rejection and optional authenticated
   self-hosted collaboration. Neither is implemented today.
4. Add richer media controls, syntax highlighting, localization, mentions, slash
   commands, and dedicated framework adapters as separately tested milestones.

## Self-hosted build

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm pre-publish
```

Copy `packages/html/dist/likha-editor.umd.js` and `likha-editor.css` to your
own static asset directory, then use:

```html
<link rel="stylesheet" href="/assets/likha-editor.css">
<div id="editor"></div>
<script src="/assets/likha-editor.umd.js"></script>
<script>
  const instance = LikhaEditor.createEditor({
    element: '#editor',
    content: '<p>Start writing</p>',
    toolbarButtons: ['heading', 'bold', 'italic', 'link', 'undo', 'redo'],
    onChange: html => console.log(html)
  });
  // Call instance.destroy() when unmounting the editor.
</script>
```

CDNs can serve the same files from a published version. Pin the package version
in production; these local changes will not be available on public CDNs until
the owner publishes a release.

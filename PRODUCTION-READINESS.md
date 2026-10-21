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

## Release blockers and subsequent milestones

1. **Browser and accessibility verification:** add real Chromium, Firefox, and
   WebKit tests for selections, paste, IME composition, mobile input, keyboard-only
   controls, multiple instances, focus, read-only mode, and offline UMD delivery.
   DOM unit tests do not establish cross-browser or WCAG compliance.
2. **Type and UI debt:** finish strict lint cleanup; replace prompt-based dialogs;
   complete dropdown/table-grid keyboard navigation, toolbar/plugin visibility,
   dark theme configuration, and error handling for invalid containers.
3. **Professional editing:** table row/column insertion and removal, headers,
   cell merge/split, find/replace, Markdown/JSON import/export, autosave adapters,
   media upload hooks, resize UI, and syntax highlighting.
4. **Review workflows:** implement comments, annotations, tracked changes,
   acceptance/rejection, and version history with persistence adapters and tests.
   These are not implemented today.
5. **Optional self-hosted collaboration:** document protocol, authentication,
   authorization, concurrent-edit recovery, presence, and server deployment.
6. **Release validation:** test packed npm artifacts in clean consumer projects,
   audit dependencies again, verify license notices, measure large-document
   performance, and update documentation to match supported behavior.

Client-side schema/URL checks are not a general server-side HTML sanitizer.
Applications accepting stored content need their own server-side validation.
No npm publication, GitHub push, or production deployment is part of milestone 1.

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

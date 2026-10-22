# Release status

LikhaEditor is **pre-1.0**. On npm, `@likhaeditor/core`, `ui`, `plugins`, and `likhaeditor` are published at **0.0.3**. `@likhaeditor/likhaeditor-react` is in the monorepo; if it is not yet on npm, use the [React guide](/guide/react) with `@likhaeditor/likhaeditor` or republish per [RELEASE_CHECKLIST](https://github.com/ProgrammerNomad/likhaeditor/blob/main/RELEASE_CHECKLIST.md). This site and playground describe the repository build.

After publishing, wait a few minutes before `npm view @scope/pkg@0.0.3` - an immediate 404 is often registry propagation delay, not a failed upload.

## Implemented

| Area | Available |
| --- | --- |
| Editing | Headings, inline formatting, nested lists, links, blockquotes, undo/redo, typography (font family/size) |
| Tables | Row/column operations, headers, selection, merge/split, deletion |
| Productivity | Find/replace, character count, placeholders, read-only mode, slash-command hook, emoji insert |
| Content | HTML, JSON, CommonMark subset, embed blocks (YouTube/Vimeo), mentions mark |
| Review | Comments, track changes plugin (accept/reject via commands), optional collab transport hooks |
| Persistence | Autosave, version snapshots, media-library callback (host-owned assets) |
| Media | URL images, upload adapter, paste/drop |
| Delivery | ESM, CommonJS, UMD, CSS, TypeScript declarations |
| Adapters | `@likhaeditor/likhaeditor-react`, Composer packages `likha/laravel` and `likha/livewire` in-repo |

## Verification and limits

Automated unit and Playwright checks run in CI on push. They are not WCAG certification, full IME/device coverage, or large-document performance guarantees. See [PRODUCTION-READINESS.md](https://github.com/ProgrammerNomad/likhaeditor/blob/main/PRODUCTION-READINESS.md) for release gates.

## Still planned for 1.0

See [ROADMAP.md](https://github.com/ProgrammerNomad/likhaeditor/blob/main/ROADMAP.md) for the full checklist. Highlights:

- [ ] Hosted collaboration server, presence, and authenticated multi-user editing
- [ ] Rich media UI (crop/rotate, bundled library UI)
- [ ] Localization, mention autocomplete UI, polished slash menu
- [ ] Formal accessibility audit and community launch milestones (Phase 8)

[Self-host the build](/guide/self-hosting) · [Release checklist](https://github.com/ProgrammerNomad/likhaeditor/blob/main/RELEASE_CHECKLIST.md)

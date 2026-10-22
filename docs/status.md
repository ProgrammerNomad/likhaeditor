# Release status

LikhaEditor is **pre-1.0**. This documentation and playground describe the current repository build. The package manifests still identify version 0.0.2; new changes are unreleased until the maintainer publishes a new version.

## Implemented in the development build

| Area | Available |
| --- | --- |
| Editing | Headings, inline formatting, nested lists, links, blockquotes, undo/redo |
| Tables | Row/column insertion and removal, header toggles, selection, merge/split, deletion |
| Productivity | Find-next, replace-all, character/word count, placeholders, read-only mode |
| Content | HTML, schema-validated JSON, CommonMark subset import/export |
| Review | Selected-text comments, resolve/reopen/delete, mapped anchors |
| Persistence | Autosave callback, explicit version snapshots, local or custom version store |
| Media | URL insertion and optional application-owned upload adapter; file picker, paste/drop |
| Delivery | ESM, CommonJS, standalone UMD, CSS and TypeScript declarations |

Comments are separate metadata. Removing their selected text leaves an orphaned comment; undo does not currently revive that anchor. Version snapshots contain document JSON, not comment metadata. Store both together in your application if you need complete review snapshots.

## Verification and limits

The repository has unit tests and browser checks across Chromium, Firefox, and WebKit. Browser checks cover formatting, dialogs, tables, read-only mode, multiple instances, paste parsing, comments, upload integration, and narrow layouts. These checks are not a WCAG certification or a guarantee for every operating system, mobile device, clipboard format, or IME.

## Still planned

- Automatic tracked changes with per-change accept/reject.
- Multi-user collaboration, presence, and a self-hosted authenticated server.
- Image crop/rotate UI, media library, attachments, and embeds.
- Syntax highlighting, mentions, slash commands, and localization.
- Official framework-specific adapters; plain JavaScript integration is available now.
- Full accessibility audit, real device/IME testing, and large-document performance budgets.

[Self-host the current build](/guide/self-hosting). No npm publication is needed to develop or test this website.

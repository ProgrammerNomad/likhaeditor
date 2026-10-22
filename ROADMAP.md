# Likha development roadmap

Release status for npm users: [docs/status.md](docs/status.md). Maintainer validation: [PRODUCTION-READINESS.md](PRODUCTION-READINESS.md).

Phases use GitHub-style checklists only: `[x]` done, `[ ]` not done or deferred.

**Current focus (v0.0.3):** Ship Milestone 2 on npm, keep docs and CI green, then close Phase 8 launch items and hosted collaboration for v1.0.

---

## Phase 0: Project foundation

- [x] Monorepo with pnpm workspaces
- [x] TypeScript strict mode, Vite builds, ESLint and Prettier
- [x] Vitest, GitHub repository, base documentation layout
- [x] GitHub Actions validate workflow (Windows and Linux)
- [ ] Husky commit hooks (deferred)
- [ ] Changesets for version management (deferred)

## Phase 1: Core editor engine

- [x] `@likhaeditor/core` on ProseMirror (schema, marks, undo/redo, shortcuts)
- [x] HTML serialization and deserialization
- [x] Links, lists, and paste handling in later milestones
- [x] Core unit tests

## Phase 2: Plugin system

- [x] Plugin API (commands, keymaps, ProseMirror plugins)
- [x] Example plugins and plugin tests
- [ ] Plugin dependency management (deferred)

## Phase 3: UI components

- [x] `@likhaeditor/ui` toolbar, buttons, dropdowns, table grid
- [x] Default and dark theme CSS
- [x] UI tests and basic ARIA on toolbar and editor surface
- [ ] Bubble menu and floating menu (deferred)
- [ ] Full WCAG 2.1 AA audit (deferred)

## Phase 4: Official plugins

- [x] Headings, lists, blockquote, HR, link, code block, alignment
- [x] Table, image, text color, highlight, formatting marks
- [x] Placeholder, character count, HTML source view, clear formatting
- [x] Find/replace, markdown import/export, syntax highlight, typography (font family/size)
- [x] Image upload adapter, comments, track changes plugin
- [x] Embeds, mentions mark, slash-command hook, emoji insert, collab foundation, media-library callback
- [ ] Slash command UI menu (host-owned today)
- [ ] Mention autocomplete UI (deferred)
- [ ] Slash commands, emoji picker, and mention plugins as full toolbar product (partial)

## Phase 5: Framework adapters

- [x] `@likhaeditor/likhaeditor` vanilla adapter and UMD/CDN bundle
- [x] VitePress documentation site and Netlify deploy
- [x] `@likhaeditor/likhaeditor-react` component and `useEditor` hook
- [x] `likha/laravel` Blade component and asset publishing
- [x] `likha/livewire` Livewire 3 component
- [ ] Dedicated Filament field package
- [ ] Vue, Svelte, Angular adapters (deferred)
- [ ] Next.js example app in repo (deferred)

## Phase 6: Advanced features

- [x] Drag-and-drop and paste image hooks via upload adapter
- [x] Autosave callback and version snapshots
- [x] Read-only mode and find/replace
- [x] JSON document export/import
- [x] CommonMark subset import/export
- [ ] Word/Google Docs paste polish (basic HTML paste only)
- [ ] Media library UI (callback-only today)
- [ ] Embed UI in default toolbar (command API exists)
- [ ] YouTube/Twitter embed picker UI (deferred)
- [ ] Authenticated multi-user collaboration server
- [ ] WebSocket server example and self-hosted collab docs
- [ ] Image crop/rotate UI (deferred)
- [ ] Localization (deferred)

## Phase 7: Documentation and quality

- [x] Getting started, installation, configuration, API reference
- [x] Framework guides (React, Laravel, Livewire)
- [x] Interactive playground on documentation site
- [x] Playwright browser tests (Chromium, Firefox, WebKit) and site tests
- [x] Broken link checks on documentation build
- [ ] Per-plugin documentation pages complete
- [ ] Migration guides between versions
- [ ] Video tutorials (deferred)
- [ ] Laravel blog and Next.js example projects in repo (deferred)
- [ ] Test coverage above 90% (deferred target)

## Phase 8: Community and v1.0 launch

- [x] CONTRIBUTING.md
- [x] CODE_OF_CONDUCT.md
- [x] GitHub issue and pull request templates
- [x] RELEASE_CHECKLIST.md
- [ ] GitHub Discussions enabled
- [ ] Launch announcement and demo videos
- [ ] Community plugin showcase
- [ ] Success metrics (stars, adopters, response SLAs) tracked publicly

---

## Must have for v1.0 (from original plan)

- [x] Core editing and essential plugins
- [x] Plain HTML adapter
- [x] React adapter
- [x] Laravel Blade integration
- [x] Basic documentation site
- [x] MIT license
- [ ] Livewire as separately published Composer tag (in repo; validate in sample app)
- [ ] Formal accessibility certification
- [ ] v1.0.0 semver when Phase 8 launch checklist is complete

## Post v1.0

- [ ] Real-time collaboration with presence
- [ ] Mobile touch optimization pass
- [ ] Vue and Svelte adapters
- [ ] Advanced track-changes review UI beyond plugin commands

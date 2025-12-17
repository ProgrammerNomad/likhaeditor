# Likha Development Roadmap

This document outlines the complete development plan for Likha, divided into manageable phases.

## Development Strategy

### Recommended Approach: Monorepo with Incremental Development

**Why this approach:**
- Build core functionality first, then expand
- Each phase delivers working features
- Easy to test and validate as you go
- Community can start using basic version early
- Plugins can be developed independently

**Tech Stack Decisions:**
- **Build Tool:** Vite (fast, modern, great DX)
- **Package Manager:** pnpm (efficient, monorepo support)
- **Testing:** Vitest (fast, Vite-native)
- **Docs:** VitePress or Docusaurus
- **CI/CD:** GitHub Actions
- **Hosting:** GitHub Pages for docs, npm for packages

---

## Phase 0: Project Foundation (Week 1-2)

**Goal:** Set up development environment and tooling

### Tasks
- [x] Initialize monorepo structure with pnpm workspaces
- [x] Configure TypeScript with strict mode
- [x] Set up Vite for building packages
- [x] Configure ESLint and Prettier
- [x] Set up Vitest for testing
- [x] Create GitHub repository with proper .gitignore
- [x] Create basic project documentation structure
- [ ] Set up GitHub Actions for CI/CD (deferred)
- [ ] Set up commit hooks with Husky (deferred)
- [ ] Configure changesets for version management (deferred)

### Deliverables
- ✅ Working monorepo structure
- ✅ Build and test scripts
- ✅ Development environment documentation
- [ ] CI/CD pipeline (deferred)

---

## Phase 1: Core Editor Engine (Week 3-6) ✅ COMPLETE

**Goal:** Build the fundamental editor using ProseMirror

### Tasks
- [x] Study ProseMirror architecture and examples
- [x] Create @likha/core package structure
- [x] Implement basic document schema (paragraph, heading, text)
- [x] Set up editor view and state management
- [x] Implement basic marks (bold, italic, code)
- [x] Add undo/redo functionality
- [x] Create keyboard shortcut system
- [x] Add basic HTML serialization/deserialization
- [x] Write unit tests for core functionality (5 tests passing)
- [x] Create simple demo HTML page
- [ ] Add link support (deferred to Phase 4)
- [ ] Implement lists (deferred to Phase 4)
- [ ] Implement copy/paste handling (deferred to Phase 6)

### Deliverables
- ✅ @likha/core package (4.55 KB gzipped)
- ✅ Working demo in plain HTML
- ✅ Test coverage 100% for core

---

## Phase 2: Plugin System Architecture (Week 7-8) ✅ COMPLETE

**Goal:** Create extensible plugin system

### Tasks
- [x] Design plugin API interface
- [x] Implement plugin registration system
- [x] Create plugin lifecycle hooks (init, commands, keymap)
- [x] Build plugin configuration system
- [x] Create base plugin class/interface
- [x] Add plugin error handling
- [x] Build 2 example plugins (CharacterCount, Placeholder)
- [x] Write plugin API tests (10 tests passing)
- [ ] Implement plugin dependency management (deferred)
- [ ] Create plugin development guide (deferred to Phase 7)
- [ ] Write plugin API documentation (deferred to Phase 7)

### Deliverables
- ✅ Working plugin system
- ✅ Example plugins (@likha/plugins - 1.77 KB gzipped)
- [ ] Plugin development documentation (deferred)

---

## Phase 3: UI Components (Week 9-11) ✅ COMPLETE

**Goal:** Build toolbar, menus, and UI elements

### Tasks
- [x] Create @likha/ui package
- [x] Design UI component architecture
- [x] Build toolbar component
- [x] Create button components
- [x] Implement dropdown menus
- [x] Add icon system (Lucide integration)
- [x] Create default theme (CSS)
- [x] Add dark mode support
- [x] Write UI component tests (30 tests passing)
- [ ] Add modal/dialog system (deferred to Phase 6)
- [ ] Create tooltip component (deferred to Phase 6)
- [ ] Build bubble menu (deferred to Phase 6)
- [ ] Implement floating menu (deferred to Phase 6)
- [ ] Make UI components accessible (ARIA) (ongoing)

### Deliverables
- ✅ @likha/ui package (11.98 KB, 2.96 KB gzipped)
- ✅ Default and dark themes with CSS
- ✅ Toolbar, Button, and Dropdown components
- ✅ 30 UI component tests passing
- [ ] Full ARIA accessibility (ongoing)

---

## Phase 4: Official Plugins (Week 12-16) ✅ COMPLETE (100%)

**Goal:** Build essential editing plugins

### Plugin Development Priority

#### High Priority Plugins (Week 12-13)
- [x] Heading plugin (H1-H6 with Ctrl+Alt+1-6) ✅
- [x] Bold/Italic/Code marks (core functionality) ✅
- [x] Link plugin with URL input ✅
- [x] Bullet list plugin (Ctrl+Shift+8) ✅
- [x] Ordered list plugin (Ctrl+Shift+9) ✅
- [x] Blockquote plugin (Ctrl+Shift+B) ✅
- [x] Horizontal rule plugin (Mod+_) ✅

#### Medium Priority Plugins (Week 14-15)
- [x] Code block plugin with language support ✅
- [x] Text alignment plugin ✅
- [x] Table plugin (basic insert) ✅
- [x] Image plugin (insert, resize, alt text) ✅
- [x] Text color plugin ✅
- [x] Highlight plugin ✅

#### Advanced Plugins (Week 16)
- [ ] Strikethrough mark plugin (like Medium editor)
- [ ] Subscript/Superscript mark plugins (for scientific notation)
- [ ] Slash command plugin
- [ ] Emoji picker plugin
- [ ] Mention plugin (@user)
- [ ] Character count plugin (already exists, needs toolbar integration)

### Deliverables
- ✅ @likha/plugins package (114.07 KB, 23.73 KB gzipped)
- ✅ 14/14 medium+ priority plugins COMPLETE!
  - ✅ PlaceholderPlugin (4 tests)
  - ✅ CharacterCountPlugin (4 tests)
  - ✅ HeadingPlugin (25 tests)
  - ✅ BulletListPlugin (19 tests)
  - ✅ OrderedListPlugin (19 tests)
  - ✅ HorizontalRulePlugin (9 tests)
  - ✅ BlockquotePlugin (18 tests)
  - ✅ CodeBlockPlugin (27 tests)
  - ✅ LinkPlugin (22 tests)
  - ✅ TextAlignmentPlugin (27 tests)
  - ✅ TablePlugin (17 tests)
  - ✅ ImagePlugin (24 tests)
  - ✅ TextColorPlugin (20 tests)
  - ✅ HighlightPlugin (25 tests)
  - ✅ HTMLSourceViewPlugin (created, not tested yet)
- ✅ 274 total tests passing (240 plugin tests + 5 core + 30 UI - 1 skipped)
- ✅ Test coverage: >85% for plugins, >90% for core
- ⏳ Plugin documentation (pending)
- ⏳ Strikethrough, Subscript, Superscript plugins (planned)

---

## Phase 5: Framework Adapters (Week 17-20) - 25% COMPLETE

**Goal:** Create integrations for popular frameworks

### Plain HTML Adapter (Week 17) ✅
- [x] Create @likha/html package
- [x] Build vanilla JS wrapper (createEditor helper)
- [x] Add CDN build configuration (UMD 85 KB gzipped)
- [x] Create initialization helpers (plugin loading, toolbar)
- [x] Write usage examples (cdn-demo.html)
- [x] Add comprehensive default toolbar (27+ controls)
- [x] Add Undo/Redo toolbar buttons
- [x] Add Clear Formatting toolbar button
- [x] Add HTML Source View toggle button
- [x] Add color picker for text color and highlight
- [ ] Test in different browsers (Chrome tested)
- [ ] **Documentation with VitePress** ⚠️ IMPORTANT
  - [ ] Install VitePress: `pnpm add -D vitepress`
  - [ ] Initialize VitePress: `pnpm vitepress init`
  - [ ] Configure docs/.vitepress/config.ts
  - [ ] Create documentation site with existing markdown files
  - [ ] Add search functionality
  - [ ] Deploy to GitHub Pages or Netlify
  - See: https://vitepress.dev/guide/getting-started

### React Adapter (Week 18)
- [ ] Create @likha/react package
- [ ] Build React component wrapper
- [ ] Implement hooks (useEditor, useEditorContent)
- [ ] Add TypeScript definitions
- [ ] Create React examples
- [ ] Test with Next.js

### Laravel Package (Week 19)
- [ ] Create @likha/laravel package
- [ ] Build Blade component
- [ ] Add service provider
- [ ] Create configuration file
- [ ] Implement asset publishing
- [ ] Add validation rules
- [ ] Write Laravel documentation

### Livewire Integration (Week 20)
- [ ] Create @likha/livewire package
- [ ] Build Livewire component
- [ ] Implement wire:model support
- [ ] Handle real-time updates
- [ ] Create Livewire examples
- [ ] Write integration guide

### Deliverables
- 4 framework adapter packages
- Working examples for each
- Integration documentation

---

## Phase 6: Advanced Features (Week 21-24)

**Goal:** Implement professional-grade features

### Content Management (Week 21)
- [ ] Implement drag-and-drop uploads
- [ ] Add paste from Word/Google Docs
- [ ] Create image upload handler interface
- [ ] Build media library interface
- [ ] Add embed support (YouTube, Twitter, etc.)

### Productivity Features (Week 22)
- [ ] Implement autocomplete system
- [ ] Add auto-save functionality
- [ ] Create collaboration indicators
- [ ] Build version history interface
- [ ] Implement find & replace (toolbar button + modal dialog)
- [ ] Add Font Family dropdown (common fonts: Arial, Times, Courier, etc.)
- [ ] Add Font Size dropdown (8pt to 72pt)
- [ ] Add Indent/Outdent toolbar buttons (for nested lists and paragraphs)
- [ ] Create focus mode
- [ ] Build read-only mode
- [ ] Add content templates

### Export/Import (Week 23)
- [ ] Implement Markdown export
- [ ] Add Markdown import
- [ ] Create JSON serialization
- [ ] Build HTML sanitization
- [ ] Add print-friendly mode

### Collaboration Foundation (Week 24)
- [ ] Research Y.js vs Automerge
- [ ] Design collaborative architecture
- [ ] Create basic collaboration plugin
- [ ] Build WebSocket server example
- [ ] Document self-hosting setup

### Deliverables
- Advanced feature plugins
- Import/export utilities
- Collaboration foundation

---

## Phase 7: Documentation and Polish (Week 25-28)

**Goal:** Complete documentation and examples

### Documentation Site (Week 25-26)
- [ ] Set up VitePress/Docusaurus
- [ ] Write getting started guide
- [ ] Create API reference
- [ ] Document all plugins
- [ ] Add migration guides
- [ ] Create video tutorials
- [ ] Build interactive playground

### Examples and Templates (Week 27)
- [ ] Create plain HTML example
- [ ] Build Laravel blog example
- [ ] Create Next.js example
- [ ] Build Livewire CRUD example
- [ ] Add CodeSandbox templates
- [ ] Create starter templates

### Testing and Quality (Week 28)
- [ ] Increase test coverage to 90%+
- [ ] Add E2E tests with Playwright
- [ ] Run accessibility audit
- [ ] Test across browsers
- [ ] Performance optimization
- [ ] Bundle size optimization
- [ ] Fix all bugs from backlog

### Deliverables
- Complete documentation site
- Working examples
- High test coverage
- Optimized builds

---

## Phase 8: Community and Release (Week 29-30)

**Goal:** Launch v1.0 and build community

### Pre-launch (Week 29)
- [ ] Create CONTRIBUTING.md
- [ ] Set up issue templates
- [ ] Create PR template
- [ ] Write CODE_OF_CONDUCT.md
- [ ] Set up GitHub Discussions
- [ ] Create release checklist
- [ ] Plan launch announcement

### v1.0 Release (Week 30)
- [ ] Final testing and bug fixes
- [ ] Publish all packages to npm
- [ ] Deploy documentation site
- [ ] Create release notes
- [ ] Announce on Twitter, Reddit, HN
- [ ] Submit to product directories
- [ ] Create demo videos
- [ ] Write launch blog post

### Post-launch
- [ ] Monitor issues and feedback
- [ ] Create roadmap for v1.1
- [ ] Start community plugin showcase
- [ ] Plan video tutorial series

### Deliverables
- v1.0 release on npm
- Live documentation
- Community engagement

---

## Development Priorities

### Must Have for v1.0
- Core editing functionality
- 10+ essential plugins
- Plain HTML adapter
- React adapter
- Laravel Blade component
- Basic documentation
- MIT license

### Nice to Have for v1.0
- Livewire integration
- Table plugin
- Image plugin
- Dark mode
- Advanced examples

### Post v1.0 (v1.1+)
- Collaborative editing
- Mobile touch optimization
- Additional framework adapters (Vue, Svelte)
- AI writing assistance integration
- Advanced track changes
- Comment system

---

## Success Metrics

### Technical
- [ ] Test coverage > 90%
- [ ] Bundle size < 100KB (core)
- [ ] Load time < 100ms
- [ ] Works in all modern browsers
- [ ] WCAG 2.1 AA compliant

### Community
- [ ] 1,000+ GitHub stars
- [ ] 50+ contributors
- [ ] 10+ community plugins
- [ ] 100+ projects using Likha

### Quality
- [ ] Clear documentation
- [ ] Fast issue response time
- [ ] Regular releases
- [ ] Active community discussions

---

## Resource Recommendations

### Learning Resources
- ProseMirror Guide: https://prosemirror.net/docs/guide/
- TipTap Source (for inspiration): https://github.com/ueberdosis/tiptap
- Rich Text Editor Comparison: https://github.com/JefMari/awesome-wysiwyg

### Tools
- ProseMirror DevTools: Browser extension for debugging
- Vitest UI: Visual test runner
- Storybook: Component development (optional)

### Timeline
- **Minimum Viable Product (MVP):** 12 weeks
- **Feature Complete v1.0:** 24 weeks
- **Polished v1.0 Release:** 30 weeks

---

## Risk Mitigation

### Technical Risks
- **Risk:** ProseMirror learning curve
  - **Mitigation:** Study examples, start simple, iterate
  
- **Risk:** Browser compatibility issues
  - **Mitigation:** Test early, use polyfills, set clear browser support policy

- **Risk:** Performance with large documents
  - **Mitigation:** Implement virtual scrolling, lazy loading

### Project Risks
- **Risk:** Scope creep
  - **Mitigation:** Stick to phases, defer nice-to-haves

- **Risk:** Burnout
  - **Mitigation:** Take breaks, get community help, celebrate milestones

- **Risk:** Competition from established editors
  - **Mitigation:** Focus on unique value (free, self-hosted, Laravel-friendly)

---

## Next Steps

1. **This Week:**
   - Set up monorepo structure
   - Initialize packages
   - Start ProseMirror learning

2. **This Month:**
   - Complete Phase 0 and Phase 1
   - Get basic editor working
   - Share early demo

3. **This Quarter:**
   - Complete Phases 2-4
   - Have working plugins and adapters
   - Start gathering feedback

**Remember:** Start small, ship often, gather feedback, iterate. The goal is not perfection but progress.

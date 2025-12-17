# Likha Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/ProgrammerNomad/likha)](https://github.com/ProgrammerNomad/likha/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/ProgrammerNomad/likha)](https://github.com/ProgrammerNomad/likha/issues)

Likha is a completely free, open-source, self-hosted, framework-agnostic rich text editor built for developers who demand flexibility without vendor lock-in. Run it anywhere: static HTML, Laravel, Livewire, React, Next.js, and more. Likha comes from the Hindi word "लिखा", meaning "written".

[Demo](https://likha-demo.example.com) | [Documentation](https://docs.likha.dev) | [Examples](./examples) | [Plugins](./packages/plugins)

## Why Likha

- Free forever under the MIT license
- No mandatory cloud services or accounts
- Runs in plain HTML without build tooling
- Friendly with Laravel, Livewire, and other backends
- Works with your preferred frontend framework

## Quick Start

### CDN (Plain HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@likha/ui/dist/likha.css">
</head>
<body>
  <div id="editor"></div>
  
  <script type="module">
    import { Editor } from "https://cdn.jsdelivr.net/npm/@likha/core/dist/likha.js";
    
    const editor = new Editor({
      element: document.getElementById("editor"),
      content: "<p>Start writing...</p>"
    });
  </script>
</body>
</html>
```

### NPM Installation

```bash
npm install @likha/core @likha/ui @likha/plugins
```

```ts
import { Editor } from '@likha/core';
import '@likha/ui/dist/likha.css';

const editor = new Editor({
  element: document.getElementById('editor'),
  plugins: [/* your plugins */]
});
```

### Laravel

```bash
composer require likha/laravel
```

```blade
<x-likha-editor name="content" :value="old('content', $post->content)" />
```

## Core Principles

- 100 percent open source (MIT)
- Self-hosted only, zero SaaS dependencies
- Framework-agnostic core architecture
- Works in a plain HTML page
- Plugin-based feature model
- No gated or paywalled functionality
- Developer-first ergonomics and documentation

## What Likha Is (and Is Not)

### Likha is

- A modern rich text editor platform
- Fully extensible through plugins
- Suitable for admin panels, CMS, SaaS apps, and dashboards
- Welcoming to Laravel and Livewire workflows
- Safe for commercial projects

### Likha is not

- A hosted cloud service
- A SaaS subscription offering
- A CKEditor clone (all-original implementation)
- Locked into any single framework

## Comparison with Other Editors

| Feature | Likha | TipTap | Quill | CKEditor | Slate |
|---------|-------|--------|-------|----------|-------|
| License | MIT (Free) | MIT (Free) | BSD | GPL/Commercial | MIT (Free) |
| Self-Hosted | Yes | Yes | Yes | Yes | Yes |
| Cloud Required | No | No | No | Optional | No |
| Framework | Agnostic | React-focused | Agnostic | Agnostic | React-only |
| Plain HTML | Yes | No | Yes | Yes | No |
| Laravel Support | First-class | Manual | Manual | Manual | Manual |
| Plugin System | Yes | Yes | Limited | Yes | Custom |
| Commercial Use | Free | Free | Free | Paid/GPL | Free |
| Track Changes | Yes | Premium | No | Premium | Custom |
| Collaborative | Planned | Premium | No | Premium | Custom |

## Feature Roadmap

### Core editing

- Paragraphs and headings
- Bold, italic, underline
- Links and lists
- Undo and redo with keyboard shortcuts

### Advanced blocks

- Tables with resize and cell merge
- Images with upload, resize, and alignment controls
- Code blocks with syntax highlighting
- Blockquotes and horizontal rules

### Professional capabilities (self-hosted)

- Track changes and review workflows
- Commenting and annotations
- Version history and diffing
- Markdown import and export
- HTML to JSON and JSON to HTML transforms

### Integrations

- Plain HTML without build tools
- Laravel Blade components
- Livewire bindings
- React and Next.js adapters
- Vue adapter (planned)

### Content management

- Copy and paste from Word and Google Docs with formatting preservation
- Drag and drop image uploads with preview
- Inline image editing (crop, rotate, filters)
- File attachments and media library
- Embeds (YouTube, Twitter, CodePen, etc.)
- Custom content blocks

### Productivity features

- Slash commands for quick block insertion
- Autocomplete and mentions (@user, #tag)
- Emoji picker with search
- Character and word count
- Read-only and focus modes
- Auto-save with configurable intervals
- Find and replace within content

### Internationalization and accessibility

- Multi-language UI support (i18n)
- Right-to-left (RTL) text support
- ARIA labels and keyboard navigation
- Screen reader compatibility
- High contrast and dark mode themes

### Export and import

- Export to PDF with custom styling
- Print-friendly formatting
- Import from Markdown, HTML, plain text
- Export to Markdown, JSON, HTML
- Content sanitization and XSS protection

### Developer experience

- TypeScript definitions included
- Comprehensive API documentation
- Testing utilities and helpers
- Extensive code examples
- Migration guides from other editors
- Custom schema definitions
- Event hooks and middleware

### Advanced capabilities

- Optional collaborative editing module powered by self-hosted WebSocket servers
- Real-time presence indicators
- Visual theme marketplace backed by community-created plugins
- Accessibility audit tooling to ensure WCAG compliance out of the box
- AI-powered writing assistance (bring your own API)
- Grammar and spell checking (pluggable backends)
- Content templates and snippets library

## Works Everywhere

### Plain HTML (no build tools)

```html
<div id="editor"></div>

<script type="module">
	import { Editor } from "https://cdn.jsdelivr.net/npm/likha/dist/likha.js";

	const editor = new Editor({
		element: document.getElementById("editor"),
		content: "<p>Hello from Likha</p>"
	});

	console.log(editor.getHTML());
</script>
```

### Laravel Blade

```blade
<x-likha-editor name="content" :value="$post->content" />
```

### Livewire

```blade
<x-likha-editor wire:model.defer="content" />
```

### React or Next.js

```tsx
<LikhaEditor value={value} onChange={setValue} />
```

## Plugin-Based Architecture

Everything in Likha is delivered as a plugin, so you only ship what you enable.

```ts
editor.use(TablePlugin);
editor.use(ImagePlugin);
editor.use(TrackChangesPlugin);
```

- No plugin, no bundle size increase
- Fully tree-shakable builds
- First-class support for community plugins

## Architecture Overview

```
likha/
├─ packages/
│  ├─ core        # Editor engine (framework agnostic)
│  ├─ ui          # Toolbar, menus, themes
│  ├─ plugins     # Official plugins
│  ├─ html        # Plain HTML adapter
│  ├─ react       # React adapter
│  ├─ laravel     # Laravel package
│  └─ livewire    # Livewire integration
├─ examples/
│  ├─ html
│  ├─ laravel
│  └─ nextjs
└─ docs/
```

## Tech Stack

- TypeScript throughout the monorepo
- ProseMirror (MIT) for the editing substrate
- ES modules and modern build tooling (pnpm workspace)
- Zero framework dependency inside the core package

## Package Naming

All official packages live under the @likha scope:

- @likha/core
- @likha/ui
- @likha/plugins
- @likha/html
- @likha/react
- @likha/laravel
- @likha/livewire

## License

Likha is distributed under the MIT License.

- Free for personal and commercial use
- Redistribution allowed without attribution
- No hidden clauses or feature gating

## Contributing

Contributions are welcome and encouraged. You can help by:

- Implementing new plugins
- Improving documentation and examples
- Fixing bugs or regressions
- Reviewing architecture decisions
- Writing starter templates for new frameworks

Please review CONTRIBUTING.md before submitting a pull request.

## Roadmap to Version 1.0

- Ship the core editor engine
- Release a starter plugin bundle
- Publish the plain HTML adapter
- Deliver the Laravel Blade component
- Finalize Livewire integration package
- Launch official documentation site
- Bootstrap community plugin gallery

## Vision

Likha aims to become the default open-source editor for developers seeking freedom, control, and simplicity without licenses, clouds, or lock-in. The goal is a modular platform that grows with your product and embraces the ecosystems you already trust.

## Frequently Asked Questions

### Is Likha really free?

Yes, completely free. MIT licensed with no hidden costs, premium tiers, or feature gating. Use it in commercial projects without attribution requirements.

### Does Likha require a backend server?

No mandatory backend. Likha runs entirely in the browser. You only need a server if you want features like image uploads, which you control and implement yourself.

### Can I use Likha offline?

Yes, Likha works completely offline once loaded. No internet connection required for editing.

### How does Likha compare to TipTap?

Both are excellent. Likha focuses on framework-agnostic design with first-class Laravel/Livewire support and works in plain HTML without build tools. TipTap is React/Vue focused and requires a build step.

### Will there be a paid version?

No. Likha will remain 100 percent free and open source forever. No premium plans, no enterprise editions, no feature paywalls.

### How is collaborative editing implemented?

Collaborative editing is planned as an optional self-hosted module using operational transformation or CRDT algorithms. You host your own WebSocket server - no third-party services required.

### Can I migrate from CKEditor or TinyMCE?

Yes, migration guides and content conversion tools are planned to help you switch from other editors while preserving your existing content.

### What is the browser support?

Likha targets modern evergreen browsers (Chrome, Firefox, Safari, Edge). IE11 is not supported.

### How can I get help?

Check the [documentation](https://docs.likha.dev), browse [examples](./examples), open an [issue](https://github.com/ProgrammerNomad/likha/issues), or join our community discussions.

## Community and Support

- [GitHub Discussions](https://github.com/ProgrammerNomad/likha/discussions) - Ask questions and share ideas
- [Issue Tracker](https://github.com/ProgrammerNomad/likha/issues) - Report bugs and request features  
- [Discord Server](https://discord.gg/likha) - Join the community (Coming soon)
- [Twitter](https://twitter.com/likhaeditor) - Follow for updates (Coming soon)

## Support the Project

Likha is and always will be free. You can support its development by:

- Star the repository on [GitHub](https://github.com/ProgrammerNomad/likha)
- Share Likha with your network and colleagues
- Report bugs with detailed reproduction steps
- Suggest features and integrations
- Contribute code, documentation, or plugins
- Write blog posts or tutorials about Likha
- Sponsor development (GitHub Sponsors coming soon)
- Help answer questions in Discussions

## Acknowledgments

Likha is built on the shoulders of giants:

- [ProseMirror](https://prosemirror.net/) - The powerful editing framework
- All our [contributors](https://github.com/ProgrammerNomad/likha/graphs/contributors)
- The open-source community

## Author

- Shiv Singh (GitHub: @ProgrammerNomad)
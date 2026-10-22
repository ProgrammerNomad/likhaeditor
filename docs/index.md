---
layout: home

hero:
  name: 'LikhaEditor'
  text: 'Modern Rich Text Editor'
  tagline: 'Free, framework-agnostic, and built on ProseMirror. Self-host the editor or serve it from a CDN.'
  image:
    src: /logo.svg
    alt: LikhaEditor
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/ProgrammerNomad/likhaeditor

features:
  - icon:
      src: /icons/code.svg
    title: Framework-Agnostic Core
    details: Vanilla JavaScript API for your frontend or backend framework
  - icon:
      src: /icons/tag.svg
    title: Lightweight
    details: Standalone browser bundle and CSS, with no required cloud services
  - icon:
      src: /icons/grid.svg
    title: Plugin-Based Architecture
    details: Modular design - enable only the features you use
  - icon:
      src: /icons/server.svg
    title: Self-Hosted
    details: No cloud dependencies, no telemetry, complete control
  - icon:
      src: /icons/info.svg
    title: Accessible
    details: Keyboard navigation and accessible controls; full accessibility audit planned
  - icon:
      src: /icons/file.svg
    title: MIT Licensed
    details: Free for personal and commercial use under the MIT license
  - icon:
      src: /icons/plus.svg
    title: Built on ProseMirror
    details: Powered by proven editor framework used by top products
  - icon:
      src: /icons/settings.svg
    title: Customizable Toolbar
    details: Choose which buttons appear, create custom layouts
  - icon:
      src: /icons/moon.svg
    title: Theme Support
    details: Light and dark themes built-in, fully customizable
---

## What is LikhaEditor?

LikhaEditor is a **modern, framework-agnostic rich text editor** built on ProseMirror. It's designed to be lightweight, self-hosted, and easy to integrate into any web project.

### Key Features

- **Framework-Agnostic Core** - Vanilla API; dedicated framework adapters remain planned
- **Self-hosted delivery** - Standalone browser bundle and CSS for your server or CDN
- **Plugin-Based Architecture** - Only load what you need
- **Self-Hosted** - No cloud dependencies or telemetry
- **Keyboard controls** - Tested dialogs, dropdowns, and table navigation; accessibility audit planned
- **MIT Licensed** - Free for commercial use
- **Professional editing** - Table operations, find/replace, comments, JSON/Markdown, autosave and upload callbacks in the development build

## Quick Links

- [Getting Started](/guide/getting-started)
- [Installation](/guide/installation)
- [Interactive Playground](/playground)
- [Professional Editing](/guide/professional-editing)
- [Self-hosting](/guide/self-hosting)
- [API Reference](/api/core)
- [Plugins](/plugins/README)
- [GitHub Repository](https://github.com/ProgrammerNomad/likhaeditor)

## Current Status

**Package manifest version:** 0.0.2<br>
**Development status:** New features are implemented locally and await the next release. The playground uses this website’s repository build. See [release status](/status) for verified capabilities and remaining work.

### NPM Packages

The four editor packages use the `@likhaeditor` npm scope. Planned adapters are listed separately below. npm badges show published versions; they do not include unreleased development changes.

| Package | npm | Description | Status |
|---------|-----|-------------|--------|
| [@likhaeditor/core](https://www.npmjs.com/package/@likhaeditor/core) | ![npm](https://img.shields.io/npm/v/@likhaeditor/core) | Framework-agnostic editor engine | Pre-1.0 |
| [@likhaeditor/ui](https://www.npmjs.com/package/@likhaeditor/ui) | ![npm](https://img.shields.io/npm/v/@likhaeditor/ui) | Toolbar and UI components | Pre-1.0 |
| [@likhaeditor/plugins](https://www.npmjs.com/package/@likhaeditor/plugins) | ![npm](https://img.shields.io/npm/v/@likhaeditor/plugins) | Official plugin collection | Pre-1.0 |
| [@likhaeditor/likhaeditor](https://www.npmjs.com/package/@likhaeditor/likhaeditor) | ![npm](https://img.shields.io/npm/v/@likhaeditor/likhaeditor) | Vanilla JS wrapper | Pre-1.0 |
| `@likhaeditor/likhaeditor-react` | - | React components | 🚧 Planned |
| `@likhaeditor/likhaeditor-laravel` | - | Laravel Blade components | 🚧 Planned |
| `@likhaeditor/likhaeditor-livewire` | - | Livewire integration | 🚧 Planned |

**Installation:**
```bash
npm install @likhaeditor/likhaeditor
```

## Browser Support

- Targets modern Chrome, Edge, Firefox, and Safari
- Automated editor tests run in Chromium, Firefox, and WebKit
- Real-device, IME, and screen-reader verification remains in progress

## Community

- **NPM:** [View all packages](https://www.npmjs.com/search?q=%40likhaeditor)
- **Issues:** [GitHub Issues](https://github.com/ProgrammerNomad/likhaeditor/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)
- **Changelog:** [View Release History](https://likhaeditor.netlify.app/changelog)
- **License:** [MIT](https://github.com/ProgrammerNomad/likhaeditor/blob/main/LICENSE)

## Credits

Built with [ProseMirror](https://prosemirror.net/) by Marijn Haverbeke.

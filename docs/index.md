---
layout: home

hero:
  name: 'LikhaEditor'
  text: 'Modern Rich Text Editor'
  tagline: 'Framework-agnostic, self-hosted, built on ProseMirror. Works everywhere - from vanilla HTML to React, Laravel & Livewire.'
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
    details: Works with vanilla JS, React, Laravel, Livewire - integrate anywhere
  - icon:
      src: /icons/tag.svg
    title: Lightweight
    details: Core bundle under 100KB gzipped, only load what you need
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
    details: WCAG 2.1 AA compliant with keyboard navigation
  - icon:
      src: /icons/file.svg
    title: MIT Licensed
    details: Free for commercial use, no restrictions
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

- **Framework-Agnostic Core** - Works with vanilla JS, React, Laravel, Livewire
- **Lightweight** - Core bundle < 100KB gzipped
- **Plugin-Based Architecture** - Only load what you need
- **Self-Hosted** - No cloud dependencies or telemetry
- **Accessible** - WCAG 2.1 AA compliant
- **MIT Licensed** - Free for commercial use

## Quick Links

- [Getting Started](/guide/getting-started)
- [Installation](/guide/installation)
- [API Reference](/api/core)
- [Plugins](/plugins/)
- [GitHub Repository](https://github.com/ProgrammerNomad/likhaeditor)

## Current Status

**Version:** 0.0.1  
**Released:** December 18, 2025

### NPM Packages

All packages are available on npm under the `@likhaeditor` scope:

| Package | npm | Description | Status |
|---------|-----|-------------|--------|
| [@likhaeditor/core](https://www.npmjs.com/package/@likhaeditor/core) | ![npm](https://img.shields.io/npm/v/@likhaeditor/core) | Framework-agnostic editor engine | ✅ Stable |
| [@likhaeditor/ui](https://www.npmjs.com/package/@likhaeditor/ui) | ![npm](https://img.shields.io/npm/v/@likhaeditor/ui) | Toolbar and UI components | ✅ Stable |
| [@likhaeditor/plugins](https://www.npmjs.com/package/@likhaeditor/plugins) | ![npm](https://img.shields.io/npm/v/@likhaeditor/plugins) | Official plugin collection | ✅ Alpha |
| [@likhaeditor/likhaeditor](https://www.npmjs.com/package/@likhaeditor/likhaeditor) | ![npm](https://img.shields.io/npm/v/@likhaeditor/likhaeditor) | Vanilla JS wrapper | ✅ Alpha |
| `@likhaeditor/likhaeditor-react` | - | React components | 🚧 Planned |
| `@likhaeditor/likhaeditor-laravel` | - | Laravel Blade components | 🚧 Planned |
| `@likhaeditor/likhaeditor-livewire` | - | Livewire integration | 🚧 Planned |

**Installation:**
```bash
npm install @likhaeditor/likhaeditor
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Community

- **NPM:** [View all packages](https://www.npmjs.com/search?q=%40likhaeditor)
- **Issues:** [GitHub Issues](https://github.com/ProgrammerNomad/likhaeditor/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)
- **Changelog:** [View Release History](https://likhaeditor.netlify.app/changelog)
- **License:** [MIT](https://github.com/ProgrammerNomad/likhaeditor/blob/main/LICENSE)

## Credits

Built with [ProseMirror](https://prosemirror.net/) by Marijn Haverbeke.

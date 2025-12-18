---
layout: home

hero:
  name: 'Likha Editor'
  text: 'Modern Rich Text Editor'
  tagline: 'Framework-agnostic, self-hosted, built on ProseMirror. Works everywhere - from vanilla HTML to React, Laravel & Livewire.'
  image:
    src: /logo.svg
    alt: Likha Editor
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/ProgrammerNomad/likha

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

## What is Likha?

Likha is a **modern, framework-agnostic rich text editor** built on ProseMirror. It's designed to be lightweight, self-hosted, and easy to integrate into any web project.

### Key Features

- **Framework-Agnostic Core** - Works with vanilla JS, React, Laravel, Livewire
- **Lightweight** - Core bundle < 100KB gzipped
- **Plugin-Based Architecture** - Only load what you need
- **Self-Hosted** - No cloud dependencies or telemetry
- **Accessible** - WCAG 2.1 AA compliant
- **MIT Licensed** - Free for commercial use

## Quick Links

- [Getting Started](./getting-started.md)
- [Installation](./installation.md)
- [API Reference](./api/README.md)
- [Plugins](./plugins/README.md)
- [GitHub Repository](https://github.com/ProgrammerNomad/likha)

## Current Status

**Version:** 0.1.0-alpha  
**Phase:** 4 - Plugin Development (14/14 plugins complete)

### Available Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@nomadprogrammer/likha-core` | Framework-agnostic editor engine | ✅ Stable |
| `@nomadprogrammer/likha-ui` | Toolbar and UI components | ✅ Stable |
| `@nomadprogrammer/likha-plugins` | Official plugin collection | ✅ Alpha |
| `@nomadprogrammer/likha` | Vanilla JS wrapper | ✅ Alpha |
| `@nomadprogrammer/likha-react` | React components | 🚧 Planned |
| `@nomadprogrammer/likha-laravel` | Laravel Blade components | 🚧 Planned |
| `@nomadprogrammer/likha-livewire` | Livewire integration | 🚧 Planned |

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Community

- **Issues:** [GitHub Issues](https://github.com/ProgrammerNomad/likha/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ProgrammerNomad/likha/discussions)
- **License:** [MIT](../LICENSE)

## Credits

Built with [ProseMirror](https://prosemirror.net/) by Marijn Haverbeke.

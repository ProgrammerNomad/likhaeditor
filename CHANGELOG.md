# Changelog

All notable changes to Likha Editor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial alpha release
- Core editor engine with ProseMirror foundation
- 14 official plugins
- Vanilla JS wrapper (@likha/html)
- Default toolbar with 27+ controls
- Color picker for text color and highlight
- Keyboard shortcuts for common operations

## [0.1.0-alpha] - 2025-12-17

### Added
- **Core Package** (@likha/core)
  - Framework-agnostic editor engine
  - Custom ProseMirror schema with text alignment support
  - Basic editing commands (bold, italic, underline, etc.)
  - Plugin architecture
  - Undo/redo functionality

- **Plugins Package** (@likha/plugins) - 14 plugins
  - PlaceholderPlugin - Show placeholder text
  - CharacterCountPlugin - Track character/word count
  - HeadingPlugin - H1-H6 heading support
  - BulletListPlugin - Unordered lists with Enter key handling
  - OrderedListPlugin - Numbered lists with sequential numbering
  - BlockquotePlugin - Blockquote formatting
  - TextAlignmentPlugin - Left, center, right, justify alignment
  - LinkPlugin - Hyperlink insertion and editing
  - ImagePlugin - Image insertion with attributes
  - TablePlugin - Basic table support (3x3 default)
  - HorizontalRulePlugin - Insert horizontal rules
  - CodeBlockPlugin - Code block formatting
  - TextColorPlugin - Text color with color picker
  - HighlightPlugin - Background highlight with color picker
  - StrikethroughPlugin - Strikethrough text
  - SubscriptPlugin - Subscript formatting (H₂O)
  - SuperscriptPlugin - Superscript formatting (E=mc²)
  - ClearFormattingPlugin - Remove all formatting
  - HTMLSourceViewPlugin - Toggle HTML source view

- **UI Package** (@likha/ui)
  - Toolbar component
  - Button component
  - Dropdown component
  - Color picker with 80-color palette

- **HTML Package** (@likha/html)
  - `createEditor()` function for vanilla JS usage
  - Auto-generated toolbar with all features
  - UMD build for CDN usage

### Features
- **Keyboard Shortcuts**
  - Ctrl+B: Bold
  - Ctrl+I: Italic
  - Ctrl+U: Underline
  - Ctrl+Shift+S: Strikethrough
  - Ctrl+Z: Undo
  - Ctrl+Y: Redo
  - Ctrl+K: Link
  - Ctrl+Shift+8: Bullet List
  - Ctrl+Shift+9: Numbered List
  - Ctrl+,: Subscript
  - Ctrl+.: Superscript
  - Ctrl+\: Clear Formatting
  - Ctrl+Shift+L/E/R/J: Align left/center/right/justify
  - Enter (in list): New list item

- **Toolbar Features**
  - Heading dropdown (Paragraph, H1-H6)
  - Undo/Redo buttons
  - Text formatting (B, I, U, Strikethrough)
  - Subscript and Superscript
  - Clear formatting button
  - Link insertion
  - Lists (bullet and numbered)
  - Blockquote
  - Text alignment (4 options)
  - Image insertion
  - Table insertion
  - Horizontal rule
  - Code block
  - Text color with visual picker
  - Highlight with visual picker
  - HTML source view toggle

### Technical Details
- Built with TypeScript (strict mode)
- Uses Vite for bundling
- ProseMirror-based architecture
- Tree-shakeable ES modules
- UMD build for browsers
- Comprehensive test coverage (Vitest)

### Bundle Sizes
- @likha/core: 3.3 KB gzipped
- @likha/plugins: 25 KB gzipped
- @likha/html: 85 KB gzipped (UMD)

## Known Issues

- List items don't support text alignment (alignment applies to list container)
- Color picker may appear off-screen on small viewports
- Test files have TypeScript declaration errors (not affecting runtime)

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features:
- Phase 5: React package
- Phase 6: Advanced formatting (font family, size, indent)
- Phase 7: Laravel & Livewire packages
- Phase 8: Performance & accessibility

---

**Legend:**
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security fixes

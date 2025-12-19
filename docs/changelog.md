---
title: Changelog
description: Release history and version updates for Likha Editor
---

# Changelog

All notable changes to Likha Editor are documented here.

## [0.0.2] - 2025-12-19

### 🐛 Bug Fixes

**List Functionality**
- Fixed Enter key behavior in bullet and ordered lists
- Lists now properly create new items on Enter press
- Double Enter correctly exits list and creates paragraph
- Implemented ProseMirror's `splitListItem` command for standard list behavior

**Table Features**
- Added visual table grid selector (10×10 cells) similar to CKEditor
- Hover highlighting shows selected table dimensions
- Click to insert table with chosen rows/columns
- Improved table insertion UX

**Text Formatting**
- Fixed text color and highlight not working together
- Nested mark elements now properly inherit text color
- Background highlight no longer overrides text color
- Both formatting options can be applied simultaneously

**UI Improvements**
- Color picker dropdowns now close when opening another color picker
- Fixed mutually exclusive popup behavior
- Global tracking prevents multiple color pickers from staying open

### 🔧 Internal Changes
- Added `prosemirror-state` dependency to plugins package
- Removed conflicting Enter key handlers from individual list plugins
- Unified list keymap handling in core editor
- Updated CSS for proper mark element color inheritance
- Build system optimization (removed redundant TypeScript declaration generation)

---

## [0.0.1] - 2025-12-18

### 🎉 First Public Release

**NPM Packages Published**
- `@likhaeditor/core` v0.0.1
- `@likhaeditor/ui` v0.0.1
- `@likhaeditor/plugins` v0.0.1
- `@likhaeditor/likhaeditor` v0.0.1

### Added

**Core Features**
- Framework-agnostic editor engine
- Complete toolbar and UI component system
- 15 official plugins
- Vanilla JavaScript wrapper for zero-build usage
- CDN support via jsDelivr and unpkg

**Plugins**
- Text formatting: Bold, Italic, Underline, Strikethrough
- Advanced: Subscript, Superscript, Text Color, Highlight
- Headings: H1-H6 support
- Lists: Bullet lists and ordered lists
- Blocks: Blockquote, Code block, Horizontal rule
- Rich content: Links, Images, Tables
- Text alignment: Left, Center, Right, Justify
- Utilities: Clear formatting, Placeholder, Character count

**Developer Experience**
- TypeScript support with full type definitions
- Customizable toolbar with 24 built-in buttons
- Plugin-based architecture
- Tree-shakable ES modules
- Documentation site: https://likhaeditor.netlify.app/

**Bundle Sizes**
- Core: 14.18 KB (3.44 KB gzipped)
- UI: 11.95 KB (2.96 KB gzipped)
- Plugins: 124.54 KB (25.24 KB gzipped)
- HTML wrapper: 259.69 KB UMD (75.51 KB gzipped)

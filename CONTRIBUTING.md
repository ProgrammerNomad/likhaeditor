# Contributing to Likha

Thank you for considering contributing to Likha! This document outlines how to contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Plugin Development](#plugin-development)

## Code of Conduct

Be respectful, inclusive, and professional. We are building an open and welcoming community.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
- Check existing issues to avoid duplicates
- Use the latest version to verify the bug still exists
- Collect detailed information about the issue

When reporting a bug, include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or recordings if applicable
- Your environment (browser, OS, version)
- Code samples demonstrating the issue

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature has already been suggested
- Provide a clear use case
- Explain why this feature would benefit most users
- Include mockups or examples if relevant

### Code Contributions

We welcome code contributions for:
- Bug fixes
- New features (discuss first in an issue)
- Performance improvements
- Documentation improvements
- Test coverage improvements
- New plugins
- Framework adapters

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm 8+
- Git
- A code editor (VS Code recommended)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/ProgrammerNomad/likhaeditor.git
cd likha

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development mode
pnpm dev
```

### Available Scripts

```bash
pnpm build          # Build all packages
pnpm dev            # Start development mode with watch
pnpm test           # Run all tests
pnpm test:watch     # Run tests in watch mode
pnpm lint           # Lint all packages
pnpm format         # Format code with Prettier
pnpm typecheck      # TypeScript type checking
```

## Project Structure

```
likha/
├── packages/
│   ├── core/           # Core editor engine
│   ├── ui/             # UI components
│   ├── plugins/        # Official plugins
│   ├── html/           # Plain HTML adapter
│   ├── react/          # React adapter
│   ├── laravel/        # Laravel package
│   └── livewire/       # Livewire integration
├── examples/           # Example projects
├── docs/               # Documentation
├── scripts/            # Build and utility scripts
└── tests/              # Integration tests
```

### Package Structure

Each package follows this structure:

```
package/
├── src/
│   ├── index.ts        # Main entry point
│   ├── types.ts        # TypeScript types
│   └── ...
├── tests/
│   └── *.test.ts       # Unit tests
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run tests
pnpm test

# Run specific package tests
pnpm --filter @likhaeditor/core test

# Run linting
pnpm lint

# Type check
pnpm typecheck
```

### 4. Commit Your Changes

Follow the [commit guidelines](#commit-guidelines).

```bash
git add .
git commit -m "feat(core): add new feature"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper types, avoid `any`
- Use interfaces for public APIs
- Document complex type definitions

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas
- Max line length: 100 characters
- Use meaningful variable names

### Example

```typescript
// Good
interface EditorOptions {
  element: HTMLElement;
  content?: string;
  plugins?: Plugin[];
}

export class Editor {
  private view: EditorView;
  private plugins: Plugin[] = [];

  constructor(options: EditorOptions) {
    this.initializeEditor(options);
  }

  private initializeEditor(options: EditorOptions): void {
    // Implementation
  }
}

// Bad
export class Editor {
  view: any;
  p: any[];

  constructor(opts: any) {
    this.view = opts.element;
  }
}
```

### Naming Conventions

- Classes: PascalCase (`EditorView`, `TablePlugin`)
- Functions: camelCase (`createEditor`, `getContent`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_CONFIG`, `MAX_SIZE`)
- Files: kebab-case (`editor-view.ts`, `table-plugin.ts`)
- Components: PascalCase (`Toolbar.tsx`, `MenuItem.tsx`)

## Testing Guidelines

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { Editor } from '../src';

describe('Editor', () => {
  it('should initialize with default options', () => {
    const element = document.createElement('div');
    const editor = new Editor({ element });
    
    expect(editor).toBeDefined();
    expect(editor.getHTML()).toBe('<p></p>');
  });

  it('should accept initial content', () => {
    const element = document.createElement('div');
    const editor = new Editor({
      element,
      content: '<p>Hello</p>'
    });
    
    expect(editor.getHTML()).toBe('<p>Hello</p>');
  });
});
```

### What to Test

- Public API methods
- Edge cases and error conditions
- Browser compatibility (use testing tools)
- Accessibility features
- Performance (for critical paths)

### Coverage Goals

- Core packages: 90%+ coverage
- Plugins: 80%+ coverage
- Adapters: 80%+ coverage

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements

### Scopes

- `core` - Core editor
- `ui` - UI components
- `plugins` - Plugins
- `react` - React adapter
- `laravel` - Laravel package
- `livewire` - Livewire integration
- `docs` - Documentation

### Examples

```bash
feat(core): add undo/redo functionality
fix(plugins): resolve table resize bug
docs(readme): update installation instructions
test(core): add tests for serialization
chore(deps): upgrade dependencies
```

## Pull Request Process

### Before Submitting

- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Documentation updated
- [ ] Changeset added (if applicable)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Automated checks must pass (CI/CD)
2. At least one maintainer review required
3. Address all review comments
4. Squash commits before merge (if requested)

### After Merge

- Delete your branch
- Pull the latest main branch
- Celebrate your contribution!

## Plugin Development

### Creating a New Plugin

```typescript
import { Plugin } from '@likhaeditor/core';

export class MyPlugin extends Plugin {
  name = 'my-plugin';

  init() {
    // Plugin initialization
  }

  commands() {
    return {
      myCommand: () => ({ state, dispatch }) => {
        // Command implementation
        return true;
      }
    };
  }

  inputRules() {
    // Return input rules
  }

  keymap() {
    // Return keyboard shortcuts
  }
}
```

### Plugin Guidelines

- One plugin, one responsibility
- Provide clear documentation
- Include examples
- Write tests
- Keep dependencies minimal
- Make it configurable

### Testing Plugins

```typescript
describe('MyPlugin', () => {
  it('should register commands', () => {
    const editor = new Editor({
      plugins: [new MyPlugin()]
    });
    
    expect(editor.commands.myCommand).toBeDefined();
  });
});
```

## Getting Help

- Check [documentation](https://likhaeditor.netlify.app/)
- Search [existing issues](https://github.com/ProgrammerNomad/likhaeditor/issues)
- Ask in [GitHub Discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)
- Reach out to maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

Thank you for contributing to Likha!

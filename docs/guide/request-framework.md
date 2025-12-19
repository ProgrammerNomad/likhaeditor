# Request Framework Support

Don't see your framework listed? LikhaEditor is designed to work with any JavaScript framework or backend system. We'd love to help you integrate it!

## Supported Frameworks

Currently, we have official integrations planned for:

- ✅ **Vanilla JavaScript** - Available now via CDN
- 🚧 **React** - Coming in v0.1.0 (January 2026)
- 🚧 **Laravel Blade** - Coming in v0.1.0 (January 2026)
- 🚧 **Livewire** - Coming in v0.2.0 (February 2026)
- 🚧 **Filament** - Coming in v0.3.0 (March 2026)

## Need Another Framework?

We're actively looking to support more frameworks and ecosystems. If you need LikhaEditor for a specific framework, we want to hear from you!

### Popular Requests We're Considering

- **Vue.js** - Vue 3 composition API components
- **Svelte** - Native Svelte components
- **Angular** - Angular module and components
- **Astro** - Astro island components
- **Next.js** - App Router and Pages Router optimizations
- **Nuxt.js** - SSR-ready Vue components
- **SolidJS** - Reactive primitives integration
- **Qwik** - Resumable components
- **Django** - Template tags and form fields
- **Flask** - Jinja2 template integration
- **Ruby on Rails** - View helpers and form builders
- **WordPress** - Gutenberg block integration
- **Drupal** - Field widget and formatter
- **Craft CMS** - Field type integration
- **October CMS** - Form widget
- **Express.js** - View engine integration

## How to Request

### 1. Check Existing Discussions

Before creating a new request, check if someone has already suggested your framework:

👉 [Browse Framework Requests](https://github.com/ProgrammerNomad/likhaeditor/discussions/categories/ideas)

If you find an existing request, give it a 👍 thumbs up and add your use case in the comments.

### 2. Create a New Discussion

If your framework isn't listed, create a new discussion:

1. **Go to GitHub Discussions**: [LikhaEditor Ideas](https://github.com/ProgrammerNomad/likhaeditor/discussions/categories/ideas)
2. **Click "New discussion"**
3. **Choose the "Ideas" category**
4. **Use this template**:

```markdown
## Framework Request: [Framework Name]

### Framework Details
- **Name**: [e.g., Vue.js, Django, etc.]
- **Version**: [e.g., Vue 3.x, Django 5.x]
- **Official Website**: [URL]
- **Package Manager**: [npm, pip, composer, etc.]

### Why This Framework?
Explain why LikhaEditor would be valuable for this framework's ecosystem.

### Proposed Integration
How do you envision LikhaEditor working with this framework?

Example API:
```[language]
// Your proposed usage example
```

### Use Case
Describe your specific use case or project.

### Community Size
Approximate number of developers using this framework (if known).

### I Can Help With
- [ ] Testing
- [ ] Documentation
- [ ] Code contribution
- [ ] Examples/demos
- [ ] Maintenance
```

### 3. Provide Important Details

To help us prioritize, please include:

**Technical Requirements:**
- Framework version(s) you need to support
- Build tool requirements (webpack, vite, rollup, etc.)
- Server-side rendering needs
- TypeScript support requirements

**Your Use Case:**
- What are you building?
- How many users will use it?
- Is this for an open-source project?
- Timeline/urgency

**Community Impact:**
- How popular is this framework?
- Would others benefit from this integration?
- Are you willing to help test?

## Build Your Own Integration

Can't wait for official support? LikhaEditor's framework-agnostic core makes it easy to create your own wrapper!

### Quick Integration Guide

1. **Install the core package:**
```bash
npm install @likhaeditor/likhaeditor
```

2. **Create a wrapper component** for your framework
3. **Handle lifecycle methods** (mount, unmount, updates)
4. **Manage state synchronization**
5. **Add TypeScript types** (optional but recommended)

### Example: Basic React Hook (DIY)

```tsx
import { useEffect, useRef } from 'react';
import { createEditor } from '@likhaeditor/likhaeditor';
import '@likhaeditor/likhaeditor/dist/likha-editor.css';

export function useEditor(options) {
  const elementRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (elementRef.current && !editorRef.current) {
      const { editor } = createEditor({
        element: elementRef.current,
        ...options
      });
      editorRef.current = editor;
    }

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  return { ref: elementRef, editor: editorRef.current };
}
```

### Share Your Integration

Built a wrapper for your favorite framework? Share it with the community!

1. **Publish your package** to npm/pip/packagist
2. **Share in Discussions**: [Show and Tell](https://github.com/ProgrammerNomad/likhaeditor/discussions/categories/show-and-tell)
3. **We'll feature it** in our official documentation

## Contributing Official Integrations

Want to contribute an official integration package? We'd love your help!

### Requirements

Official integrations should:

- ✅ Follow framework best practices and conventions
- ✅ Include comprehensive TypeScript types
- ✅ Have >80% test coverage
- ✅ Include documentation and examples
- ✅ Follow LikhaEditor's MIT license
- ✅ Support the latest stable framework version
- ✅ Include a README with installation and usage

### Process

1. **Discuss first**: Open a discussion to coordinate
2. **Fork the repo**: Work in `packages/[framework-name]`
3. **Follow the structure**: Match existing package patterns
4. **Write tests**: Use Vitest for testing
5. **Document thoroughly**: Include API docs and examples
6. **Submit PR**: We'll review and provide feedback

See our [Contributing Guide](https://github.com/ProgrammerNomad/likhaeditor/blob/main/CONTRIBUTING.md) for detailed guidelines.

## Framework Integration Checklist

When requesting or building an integration, consider:

- [ ] Component/wrapper API design
- [ ] State management integration
- [ ] Server-side rendering support
- [ ] TypeScript definitions
- [ ] Build tool compatibility
- [ ] Tree-shaking and bundle size
- [ ] Accessibility features
- [ ] Dark mode/theming
- [ ] Form integration
- [ ] Validation support
- [ ] File upload handling
- [ ] Internationalization (i18n)
- [ ] Documentation and examples
- [ ] Test coverage
- [ ] Migration guide (if needed)

## Priority Criteria

We prioritize integrations based on:

1. **Community demand** - Number of requests and upvotes
2. **Framework popularity** - Active user base size
3. **Contributor availability** - Community members willing to help
4. **Ecosystem fit** - How well it aligns with LikhaEditor's goals
5. **Maintenance burden** - Long-term support requirements

## Get Involved

- 💬 [Join Discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions)
- 🐛 [Report Issues](https://github.com/ProgrammerNomad/likhaeditor/issues)
- 🌟 [Star the Repo](https://github.com/ProgrammerNomad/likhaeditor)
- 🤝 [Contribute Code](https://github.com/ProgrammerNomad/likhaeditor/blob/main/CONTRIBUTING.md)

## Questions?

Not sure if your framework would be a good fit? Have questions about building an integration?

**Start a discussion**: [Ask in GitHub Discussions](https://github.com/ProgrammerNomad/likhaeditor/discussions/categories/q-a)

We're here to help make LikhaEditor work with your favorite tools!

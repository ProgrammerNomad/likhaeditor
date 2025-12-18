# Likha Editor Examples

This folder contains various demo files showing different ways to use the Likha editor.

## Quick Start Demos

### 1. **cdn-simple.html** - 🎯 **RECOMMENDED FOR BEGINNERS**
The simplest way to use Likha - just load the UMD build and call one function!

```html
<script src="likha-editor.umd.js"></script>
<script>
  const { editor } = window.LikhaEditor.createEditor({
    element: '#editor',
    toolbarContainer: '#toolbar'
  });
</script>
```

**Perfect for:**
- Quick prototypes
- Simple projects
- Learning Likha
- No build tools needed

### 2. **simple-demo.html** - ES6 Modules
Uses ES6 module imports from the built packages:

```javascript
import { createEditor } from '@likha/html';
const { editor } = createEditor({ element: '#editor', toolbarContainer: '#toolbar' });
```

**Perfect for:**
- Modern web projects
- When using a bundler (Webpack, Vite, etc.)
- TypeScript projects

## Feature-Specific Demos

### 3. **phase4-demo.html** - All Phase 4 Features
Demonstrates ALL Phase 4 plugins with manual toolbar setup:
- Text Color
- Highlight  
- Image Upload
- Tables
- Links
- Code Blocks
- Lists & Alignment
- And more!

**Perfect for:**
- Understanding individual plugins
- Custom toolbar layouts
- Advanced configurations

### 4. **full-demo.html** - Kitchen Sink
Comprehensive demo with every possible feature and custom UI:
- All plugins enabled
- Custom button configurations
- Advanced toolbar customization
- Interactive feature testing

**Perfect for:**
- Exploring all capabilities
- Testing edge cases
- Reference implementation

## Comparison

| Demo | Complexity | Setup Time | Features | Build Required |
|------|-----------|------------|----------|---------------|
| **cdn-simple.html** | ⭐ Very Easy | 30 seconds | All (auto) | No |
| **simple-demo.html** | ⭐⭐ Easy | 1 minute | All (auto) | Yes |
| **phase4-demo.html** | ⭐⭐⭐ Medium | 5 minutes | Phase 4 (manual) | Yes |
| **full-demo.html** | ⭐⭐⭐⭐ Advanced | 10+ minutes | All (manual) | Yes |

## How to Run

### Option 1: Local Web Server (Required for ES6 modules)

```bash
# Using Node.js http-server
npx http-server -p 8080 -c-1

# Using Python
python -m http.server 8080

# Using PHP
php -S localhost:8080
```

Then open: `http://localhost:8080/examples/cdn-simple.html`

### Option 2: XAMPP (PHP users)

1. Place the `likha` folder in `c:\xampp\htdocs\`
2. Start Apache from XAMPP Control Panel
3. Open: `http://localhost/likha/examples/cdn-simple.html`

### Option 3: VS Code Live Server

1. Install "Live Server" extension
2. Right-click on any demo HTML file
3. Select "Open with Live Server"

## What's the Difference?

### UMD Build (cdn-simple.html)
```html
<!-- Single script tag -->
<script src="../packages/html/dist/likha-editor.umd.js"></script>
<script>
  window.LikhaEditor.createEditor({ /* config */ });
</script>
```

**Pros:**
- ✅ Works immediately, no build step
- ✅ No module bundler needed
- ✅ Perfect for CDN usage
- ✅ Great for quick demos

**Cons:**
- ❌ Larger file size (all features bundled)
- ❌ No tree-shaking

### ES6 Modules (simple-demo.html)
```javascript
import { createEditor } from '../packages/html/dist/index.js';
createEditor({ /* config */ });
```

**Pros:**
- ✅ Smaller bundle with tree-shaking
- ✅ Better for production apps
- ✅ Modern JavaScript syntax
- ✅ TypeScript support

**Cons:**
- ❌ Requires a build step
- ❌ Needs a web server (not file://)

### Manual Setup (phase4-demo.html, full-demo.html)
```javascript
import { Editor } from '@likha/core';
import { Toolbar, Button } from '@likha/ui';
import { TextColorPlugin } from '@likha/plugins';

const editor = new Editor({ /* ... */ });
const toolbar = new Toolbar({ /* ... */ });
// ... manually add all buttons
```

**Pros:**
- ✅ Full control over everything
- ✅ Cherry-pick only what you need
- ✅ Maximum flexibility
- ✅ Custom UI/UX

**Cons:**
- ❌ Lots of boilerplate code
- ❌ More code to maintain
- ❌ Steeper learning curve

## Recommended Learning Path

1. **Start here:** `cdn-simple.html` - See it work in 30 seconds
2. **Next:** `simple-demo.html` - Learn the ES6 module way
3. **Then:** `phase4-demo.html` - Understand individual plugins
4. **Finally:** `full-demo.html` - Master advanced customization

## Need Help?

- 📖 **Documentation:** See main [README.md](../README.md)
- 🐛 **Issues:** [GitHub Issues](https://github.com/ProgrammerNomad/likha/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/ProgrammerNomad/likha/discussions)

## Key Concepts

### `createEditor()` vs `new Editor()`

**`createEditor()`** (Recommended)
- ✅ Auto-creates toolbar with all buttons
- ✅ Auto-loads all default plugins
- ✅ Auto-injects theme styles
- ✅ Ready to use out-of-the-box

```javascript
const { editor, toolbar } = createEditor({
  element: '#editor',
  toolbarContainer: '#toolbar',
  content: '<p>Hello!</p>'
});
```

**`new Editor()`** (Advanced)
- Low-level API
- Manual plugin registration
- Manual toolbar creation
- Manual theme injection
- Maximum control

```javascript
const editor = new Editor({
  element: document.getElementById('editor'),
  plugins: [new HeadingPlugin(), new BoldPlugin(), /* ... */]
});
// You handle toolbar creation yourself
```

## Tips & Tricks

1. **Always provide a toolbar container** - The toolbar needs somewhere to render:
   ```html
   <div id="toolbar"></div>
   <div id="editor"></div>
   ```

2. **Set initial content** - Pre-populate the editor:
   ```javascript
   createEditor({
     content: '<h1>My Title</h1><p>My content...</p>'
   });
   ```

3. **Handle changes** - React to content updates:
   ```javascript
   createEditor({
     onChange: (html) => {
       console.log('New content:', html);
       // Save to server, update preview, etc.
     }
   });
   ```

4. **Choose specific plugins** - Load only what you need:
   ```javascript
   createEditor({
     plugins: ['heading', 'bold', 'italic', 'link'] // Only these
   });
   ```

5. **Customize placeholder** - Change the empty state text:
   ```javascript
   createEditor({
     placeholder: 'Write something amazing...'
   });
   ```

## Browser Requirements

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ❌ Internet Explorer (not supported)

## Next Steps

After trying the demos:

1. **Install via NPM**: `npm install @nomadprogrammer/likha`
2. **Use in React**: Check out `@nomadprogrammer/likha-react` package (coming soon)
3. **Use in Laravel**: Check out `@nomadprogrammer/likha-laravel` package (coming soon)
4. **Build from source**: See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Made with ❤️ by the Likha team**

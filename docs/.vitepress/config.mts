import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Likha Editor',
  description: 'Modern, framework-agnostic rich text editor built on ProseMirror',
  
  ignoreDeadLinks: true,
  
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'Likha' },
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/core' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'v0.0.1',
        items: [
          { text: 'v0.0.1 (current)', link: '/' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Toolbar', link: '/guide/toolbar' }
          ]
        },
        {
          text: 'Framework Integration',
          items: [
            { text: 'React', link: '/guide/react' },
            { text: 'Laravel', link: '/guide/laravel' },
            { text: 'Livewire', link: '/guide/livewire' },
            { text: 'Filament', link: '/guide/filament' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Core', link: '/api/core' },
            { text: 'HTML Package', link: '/api/html' },
            { text: 'Plugins', link: '/api/plugins' },
            { text: 'UI Components', link: '/api/ui' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Basic Editor', link: '/examples/basic' },
            { text: 'Custom Toolbar', link: '/examples/custom-toolbar' },
            { text: 'Readonly Mode', link: '/examples/readonly' },
            { text: 'Form Integration', link: '/examples/forms' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ProgrammerNomad/likhaeditor' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 <a href=\"https://github.com/ProgrammerNomad\">ProgrammerNomad</a>'
    },

    search: {
      provider: 'local'
    }
  }
});

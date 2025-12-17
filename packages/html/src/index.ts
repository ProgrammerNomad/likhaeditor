import { Editor } from '@likha/core';
import type { Plugin } from '@likha/core';
import {
  PlaceholderPlugin,
  CharacterCountPlugin,
  HeadingPlugin,
  BulletListPlugin,
  OrderedListPlugin,
  BlockquotePlugin,
  HorizontalRulePlugin,
  LinkPlugin,
  CodeBlockPlugin,
  TextAlignmentPlugin,
  TablePlugin,
  ImagePlugin,
  TextColorPlugin,
  HighlightPlugin
} from '@likha/plugins';
import { Toolbar, Button, Dropdown, injectTheme } from '@likha/ui';

export interface LikhaEditorOptions {
  /** The element or selector to mount the editor */
  element: HTMLElement | string;
  /** Initial content (HTML string) */
  content?: string;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Enable/disable toolbar (default: true) */
  toolbar?: boolean;
  /** Toolbar container element or selector */
  toolbarContainer?: HTMLElement | string;
  /** Enable specific plugins */
  plugins?: string[];
  /** Enable dark theme */
  darkTheme?: boolean;
  /** Callback when content changes */
  onChange?: (content: string) => void;
}

/**
 * Create a Likha editor instance
 */
export function createEditor(options: LikhaEditorOptions) {
  // Resolve element
  const element = typeof options.element === 'string' 
    ? document.querySelector(options.element) as HTMLElement
    : options.element;

  if (!element) {
    throw new Error('Editor element not found');
  }

  // Inject theme
  injectTheme();

  // Determine which plugins to load
  const enabledPlugins = options.plugins || [
    'placeholder',
    'characterCount', 
    'heading',
    'bulletList',
    'orderedList',
    'blockquote',
    'horizontalRule',
    'link',
    'codeBlock',
    'textAlignment',
    'table',
    'image',
    'textColor',
    'highlight'
  ];

  const plugins: Plugin[] = [];

  if (enabledPlugins.includes('placeholder')) {
    plugins.push(new PlaceholderPlugin({ text: options.placeholder || 'Start writing...' }));
  }
  if (enabledPlugins.includes('characterCount')) {
    plugins.push(new CharacterCountPlugin());
  }
  if (enabledPlugins.includes('heading')) {
    plugins.push(new HeadingPlugin());
  }
  if (enabledPlugins.includes('bulletList')) {
    plugins.push(new BulletListPlugin());
  }
  if (enabledPlugins.includes('orderedList')) {
    plugins.push(new OrderedListPlugin());
  }
  if (enabledPlugins.includes('blockquote')) {
    plugins.push(new BlockquotePlugin());
  }
  if (enabledPlugins.includes('horizontalRule')) {
    plugins.push(new HorizontalRulePlugin());
  }
  if (enabledPlugins.includes('link')) {
    plugins.push(new LinkPlugin());
  }
  if (enabledPlugins.includes('codeBlock')) {
    plugins.push(new CodeBlockPlugin());
  }
  if (enabledPlugins.includes('textAlignment')) {
    plugins.push(new TextAlignmentPlugin());
  }
  if (enabledPlugins.includes('table')) {
    plugins.push(new TablePlugin());
  }
  if (enabledPlugins.includes('image')) {
    plugins.push(new ImagePlugin());
  }
  if (enabledPlugins.includes('textColor')) {
    plugins.push(new TextColorPlugin());
  }
  if (enabledPlugins.includes('highlight')) {
    plugins.push(new HighlightPlugin());
  }

  // Create editor
  const editor = new Editor({
    element,
    content: options.content,
    plugins
  });

  // Setup onChange callback
  if (options.onChange) {
    let timeout: any;
    editor.view.setProps({
      dispatchTransaction(transaction) {
        editor.view.updateState(editor.view.state.apply(transaction));
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          options.onChange!(editor.getHTML());
        }, 300);
      }
    });
  }

  // Create toolbar if enabled
  let toolbar: Toolbar | null = null;
  if (options.toolbar !== false) {
    const toolbarContainer = options.toolbarContainer
      ? (typeof options.toolbarContainer === 'string'
          ? document.querySelector(options.toolbarContainer) as HTMLElement
          : options.toolbarContainer)
      : null;

    if (toolbarContainer) {
      toolbar = createDefaultToolbar(editor, toolbarContainer);
    }
  }

  return {
    editor,
    toolbar,
    getContent: () => editor.getHTML(),
    setContent: (html: string) => editor.setContent(html),
    destroy: () => editor.view.destroy()
  };
}

/**
 * Create default toolbar for the editor
 */
function createDefaultToolbar(editor: Editor, container: HTMLElement) {
  const toolbar = new Toolbar({
    container,
    sticky: false
  });

  // Icons (inline SVG strings)
  const icons = {
    bold: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>',
    italic: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>',
    list: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
    numbered: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>',
    image: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    color: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16"/><path d="M6 16l6-12 6 12"/><path d="M8 12h8"/></svg>',
    highlight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>'
  };

  // Heading dropdown
  const headingDropdown = new Dropdown({
    placeholder: 'Paragraph',
    items: [
      { value: 'p', label: 'Paragraph' },
      { value: 'h1', label: 'Heading 1' },
      { value: 'h2', label: 'Heading 2' },
      { value: 'h3', label: 'Heading 3' }
    ],
    onSelect: (value) => {
      if (value === 'p') {
        editor.executeCommand('setParagraph');
      } else {
        editor.executeCommand('toggleHeading', parseInt(value.substring(1)));
      }
      editor.view.focus();
    }
  });

  toolbar.addButton(headingDropdown.getElement());
  toolbar.addSeparator();

  // Format buttons
  const boldBtn = new Button({
    icon: icons.bold,
    title: 'Bold',
    onClick: () => editor.bold(),
    isActive: () => editor.isActive('bold')
  });

  const italicBtn = new Button({
    icon: icons.italic,
    title: 'Italic',
    onClick: () => editor.italic(),
    isActive: () => editor.isActive('italic')
  });

  toolbar.addGroup([boldBtn.getElement(), italicBtn.getElement()]);
  toolbar.addSeparator();

  // List buttons
  const bulletBtn = new Button({
    icon: icons.list,
    title: 'Bullet List',
    onClick: () => editor.executeCommand('toggleBulletList')
  });

  const numberedBtn = new Button({
    icon: icons.numbered,
    title: 'Numbered List',
    onClick: () => editor.executeCommand('toggleOrderedList')
  });

  toolbar.addGroup([bulletBtn.getElement(), numberedBtn.getElement()]);
  toolbar.addSeparator();

  // Image button
  const imageBtn = new Button({
    icon: icons.image,
    title: 'Insert Image',
    onClick: () => {
      const url = prompt('Enter image URL:');
      if (url) {
        editor.executeCommand('insertImage', url);
      }
    }
  });

  // Color buttons
  const colorBtn = new Button({
    icon: icons.color,
    title: 'Text Color',
    onClick: () => {
      const color = prompt('Enter color:', 'red');
      if (color) {
        editor.executeCommand('setTextColor', color);
      }
    }
  });

  const highlightBtn = new Button({
    icon: icons.highlight,
    title: 'Highlight',
    onClick: () => {
      const color = prompt('Enter highlight color:', 'yellow');
      if (color) {
        editor.executeCommand('setHighlight', color);
      }
    }
  });

  toolbar.addGroup([imageBtn.getElement(), colorBtn.getElement(), highlightBtn.getElement()]);

  return toolbar;
}

// Export everything
export {
  Editor,
  PlaceholderPlugin,
  CharacterCountPlugin,
  HeadingPlugin,
  BulletListPlugin,
  OrderedListPlugin,
  BlockquotePlugin,
  HorizontalRulePlugin,
  LinkPlugin,
  CodeBlockPlugin,
  TextAlignmentPlugin,
  TablePlugin,
  ImagePlugin,
  TextColorPlugin,
  HighlightPlugin,
  Toolbar,
  Button,
  Dropdown,
  injectTheme
};

// Make available globally for CDN usage
if (typeof window !== 'undefined') {
  (window as any).LikhaEditor = {
    createEditor,
    Editor,
    Toolbar,
    Button,
    Dropdown,
    injectTheme
  };
}

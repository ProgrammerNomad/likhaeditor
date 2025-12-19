import { Editor } from '@likhaeditor/core';
import type { Plugin } from '@likhaeditor/core';
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
  HighlightPlugin,
  HTMLSourceViewPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  ClearFormattingPlugin
} from '@likhaeditor/plugins';
import { Toolbar, Button, Dropdown, TableGrid, injectTheme } from '@likhaeditor/ui';

/**
 * Inject essential editor styles
 */
function injectEditorStyles() {
  const styleId = 'likha-editor-styles';
  
  // Check if styles already injected
  if (document.getElementById(styleId)) {
    return;
  }

  const styles = `
    /* ProseMirror Base Styles - REQUIRED */
    .ProseMirror {
      position: relative;
      word-wrap: break-word;
      white-space: pre-wrap;
      white-space: break-spaces;
      -webkit-font-variant-ligatures: none;
      font-variant-ligatures: none;
      font-feature-settings: "liga" 0;
    }
    
    .ProseMirror pre {
      white-space: pre-wrap;
    }
    
    .ProseMirror li {
      position: relative;
    }
    
    /* Likha Editor Core Styles */
    .ProseMirror {
      outline: none;
      min-height: 200px;
      padding: 12px;
    }
    
    .ProseMirror p { margin: 0.5em 0; }
    .ProseMirror h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
    .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
    .ProseMirror h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
    
    .ProseMirror ul, .ProseMirror ol { margin: 0.5em 0; padding-left: 2em; }
    .ProseMirror li { margin: 0.25em 0; }
    
    .ProseMirror blockquote {
      border-left: 4px solid #ddd;
      margin: 1em 0;
      padding-left: 1em;
      color: #666;
    }
    
    .ProseMirror code {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }
    
    .ProseMirror pre {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 12px;
      border-radius: 4px;
      margin: 1em 0;
    }
    
    .ProseMirror pre code { background: none; border: none; padding: 0; }
    
    .ProseMirror a { color: #4A90E2; text-decoration: underline; }
    
    .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    .ProseMirror td, .ProseMirror th { border: 1px solid #ddd; padding: 8px 12px; }
    .ProseMirror th { background: #f5f5f5; font-weight: bold; }
    
    .ProseMirror hr { border: none; border-top: 2px solid #ddd; margin: 1.5em 0; }
    
    .ProseMirror img { max-width: 100%; height: auto; }
    
    /* Text formatting */
    .ProseMirror strong { font-weight: bold; }
    .ProseMirror em { font-style: italic; }
    .ProseMirror u { text-decoration: underline; }
    .ProseMirror s { text-decoration: line-through; }
    .ProseMirror sub { vertical-align: sub; font-size: 0.8em; }
    .ProseMirror sup { vertical-align: super; font-size: 0.8em; }
    
    /* CRITICAL FIX: Ensure highlight background is always visible */
    .ProseMirror mark {
      padding: 0 2px;
      border-radius: 2px;
      /* Force background to show even if style attribute present */
    }
    
    .ProseMirror mark[style*="background-color"] {
      /* Inline background-color will be applied via style attribute */
      display: inline !important;
    }
    
    /* Ensure text color and highlight work together */
    .ProseMirror span[style*="color"] mark,
    .ProseMirror mark span[style*="color"] {
      display: inline !important;
    }
    
    /* Fix for when both color and highlight are applied */
    .ProseMirror span mark,
    .ProseMirror mark span {
      display: inline;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

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
  /** Toolbar configuration - specify which buttons to show */
  toolbarButtons?: string[] | 'all';
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

  // Inject theme and editor styles
  injectTheme();
  injectEditorStyles();

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
    'highlight',
    'htmlSourceView',
    'underline',
    'strikethrough',
    'subscript',
    'superscript',
    'clearFormatting'
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
  if (enabledPlugins.includes('htmlSourceView')) {
    plugins.push(new HTMLSourceViewPlugin());
  }
  if (enabledPlugins.includes('underline')) {
    plugins.push(new UnderlinePlugin());
  }
  if (enabledPlugins.includes('strikethrough')) {
    plugins.push(new StrikethroughPlugin());
  }
  if (enabledPlugins.includes('subscript')) {
    plugins.push(new SubscriptPlugin());
  }
  if (enabledPlugins.includes('superscript')) {
    plugins.push(new SuperscriptPlugin());
  }
  if (enabledPlugins.includes('clearFormatting')) {
    plugins.push(new ClearFormattingPlugin());
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
      toolbar = createDefaultToolbar(editor, toolbarContainer, options.toolbarButtons);
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

// Track currently open color picker popup
let currentColorPickerPopup: HTMLElement | null = null;

/**
 * Show color picker popup
 */
function showColorPicker(button: HTMLElement, onSelect: (color: string) => void) {
  // Close any existing color picker first
  if (currentColorPickerPopup && currentColorPickerPopup.parentNode) {
    document.body.removeChild(currentColorPickerPopup);
    currentColorPickerPopup = null;
  }

  // Common color palette
  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
    '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
    '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
    '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
    '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
    '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
    '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
    '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
  ];

  // Create popup
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 1000;
    display: grid;
    grid-template-columns: repeat(10, 20px);
    gap: 4px;
    width: 240px;
  `;

  // Position popup below button
  const rect = button.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY + 4}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

  // Add color squares
  colors.forEach(color => {
    const square = document.createElement('div');
    square.style.cssText = `
      width: 20px;
      height: 20px;
      background: ${color};
      border: 1px solid #ddd;
      cursor: pointer;
      border-radius: 2px;
    `;
    square.title = color;
    
    square.addEventListener('mouseenter', () => {
      square.style.transform = 'scale(1.2)';
      square.style.borderColor = '#333';
    });
    
    square.addEventListener('mouseleave', () => {
      square.style.transform = 'scale(1)';
      square.style.borderColor = '#ddd';
    });

    square.addEventListener('click', (e) => {
      e.stopPropagation();
      onSelect(color);
      if (popup.parentNode) {
        document.body.removeChild(popup);
      }
      currentColorPickerPopup = null;
      document.removeEventListener('click', closePopup);
    });

    popup.appendChild(square);
  });

  // Store reference to current popup
  currentColorPickerPopup = popup;

  // Close popup when clicking outside
  const closePopup = (e: MouseEvent) => {
    if (!popup.contains(e.target as Node) && e.target !== button) {
      if (popup.parentNode) {
        document.body.removeChild(popup);
      }
      currentColorPickerPopup = null;
      document.removeEventListener('click', closePopup);
    }
  };

  setTimeout(() => {
    document.addEventListener('click', closePopup);
  }, 10);

  document.body.appendChild(popup);
}

/**
 * Create default toolbar for the editor
 */
function createDefaultToolbar(editor: Editor, container: HTMLElement, buttonConfig?: string[] | 'all') {
  const toolbar = new Toolbar({
    container,
    sticky: false
  });

  // Determine which buttons to show
  const showAll = !buttonConfig || buttonConfig === 'all';
  const enabledButtons = showAll ? [] : buttonConfig;
  
  const shouldShow = (button: string) => {
    return showAll || enabledButtons.includes(button);
  };

  // Icons (inline SVG strings)
  const icons = {
    undo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',
    redo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path></svg>',
    bold: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>',
    italic: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>',
    underline: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>',
    strikethrough: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4H9a3 3 0 0 0-2.83 4"></path><path d="M14 12a4 4 0 0 1 0 8H6"></path><line x1="4" y1="12" x2="20" y2="12"></line></svg>',
    subscript: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 5 8 8"></path><path d="m12 5-8 8"></path><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"></path></svg>',
    superscript: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 19 8-8"></path><path d="m12 19-8-8"></path><path d="M20 9h-4c0-1.5.44-2 1.5-2.5S20 5.33 20 4c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"></path></svg>',
    clearFormat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"></path><path d="M5 20h6"></path><path d="M13 4 8 20"></path><line x1="22" y1="2" x2="2" y2="22"></line></svg>',
    link: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
    blockquote: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>',
    list: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
    numbered: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>',
    alignLeft: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>',
    alignCenter: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>',
    alignRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>',
    image: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    table: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>',
    code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h2M16 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2"></path></svg>',
    hr: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line></svg>',
    color: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16"/><path d="M6 16l6-12 6 12"/><path d="M8 12h8"/></svg>',
    highlight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>',
    sourceCode: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><line x1="10" y1="6" x2="14" y2="18"></line><polyline points="8 6 2 12 8 18"></polyline></svg>'
  };

  // Heading dropdown
  const headingDropdown = new Dropdown({
    placeholder: 'Paragraph',
    items: [
      { value: 'normal', label: 'Styles' },
      { value: 'p', label: 'Paragraph' },
      { value: 'h1', label: 'Heading 1' },
      { value: 'h2', label: 'Heading 2' },
      { value: 'h3', label: 'Heading 3' },
      { value: 'h4', label: 'Heading 4' },
      { value: 'h5', label: 'Heading 5' },
      { value: 'h6', label: 'Heading 6' }
    ],
    onSelect: (value: string) => {
      if (value === 'p' || value === 'normal') {
        editor.executeCommand('setParagraph');
      } else if (value.startsWith('h')) {
        editor.executeCommand('toggleHeading', parseInt(value.substring(1)));
      }
      editor.view.focus();
    }
  });

  toolbar.addButton(headingDropdown.getElement());
  toolbar.addSeparator();

  // UNDO/REDO GROUP
  const undoBtn = new Button({
    icon: icons.undo,
    title: 'Undo (Ctrl+Z)',
    onClick: () => editor.undo()
  });

  const redoBtn = new Button({
    icon: icons.redo,
    title: 'Redo (Ctrl+Y)',
    onClick: () => editor.redo()
  });

  toolbar.addGroup([undoBtn.getElement(), redoBtn.getElement()]);
  toolbar.addSeparator();

  // TEXT FORMATTING GROUP
  const boldBtn = new Button({
    icon: icons.bold,
    title: 'Bold (Ctrl+B)',
    onClick: () => editor.bold(),
    isActive: () => editor.isActive('bold')
  });

  const italicBtn = new Button({
    icon: icons.italic,
    title: 'Italic (Ctrl+I)',
    onClick: () => editor.italic(),
    isActive: () => editor.isActive('italic')
  });

  const underlineBtn = new Button({
    icon: icons.underline,
    title: 'Underline (Ctrl+U)',
    onClick: () => editor.executeCommand('toggleUnderline'),
    isActive: () => editor.isActive('underline')
  });

  const strikethroughBtn = new Button({
    icon: icons.strikethrough,
    title: 'Strikethrough',
    onClick: () => editor.executeCommand('toggleStrikethrough'),
    isActive: () => editor.isActive('strikethrough')
  });

  const subscriptBtn = new Button({
    icon: icons.subscript,
    title: 'Subscript',
    onClick: () => editor.executeCommand('toggleSubscript'),
    isActive: () => editor.isActive('subscript')
  });

  const superscriptBtn = new Button({
    icon: icons.superscript,
    title: 'Superscript',
    onClick: () => editor.executeCommand('toggleSuperscript'),
    isActive: () => editor.isActive('superscript')
  });

  const clearFormatBtn = new Button({
    icon: icons.clearFormat,
    title: 'Clear Formatting',
    onClick: () => editor.executeCommand('clearFormat')
  });

  toolbar.addGroup([
    boldBtn.getElement(), 
    italicBtn.getElement(), 
    underlineBtn.getElement(),
    strikethroughBtn.getElement(),
    subscriptBtn.getElement(),
    superscriptBtn.getElement(),
    clearFormatBtn.getElement()
  ]);
  toolbar.addSeparator();

  // LINK BUTTON (CRITICAL - every editor has this)
  const linkBtn = new Button({
    icon: icons.link,
    title: 'Insert Link (Ctrl+K)',
    onClick: () => {
      const url = prompt('Enter link URL:', 'https://');
      if (url) {
        editor.executeCommand('setLink', url);
      }
    }
  });

  toolbar.addButton(linkBtn.getElement());
  toolbar.addSeparator();

  // LIST GROUP
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

  // BLOCKQUOTE
  const blockquoteBtn = new Button({
    icon: icons.blockquote,
    title: 'Blockquote',
    onClick: () => editor.executeCommand('toggleBlockquote')
  });

  toolbar.addButton(blockquoteBtn.getElement());
  toolbar.addSeparator();

  // TEXT ALIGNMENT GROUP
  const alignLeftBtn = new Button({
    icon: icons.alignLeft,
    title: 'Align Left',
    onClick: () => editor.executeCommand('setTextAlign', 'left')
  });

  const alignCenterBtn = new Button({
    icon: icons.alignCenter,
    title: 'Align Center',
    onClick: () => editor.executeCommand('setTextAlign', 'center')
  });

  const alignRightBtn = new Button({
    icon: icons.alignRight,
    title: 'Align Right',
    onClick: () => editor.executeCommand('setTextAlign', 'right')
  });

  toolbar.addGroup([alignLeftBtn.getElement(), alignCenterBtn.getElement(), alignRightBtn.getElement()]);
  toolbar.addSeparator();

  // INSERT GROUP (Image, Table, HR)
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

  // Table button with grid selector dropdown
  const tableBtn = document.createElement('div');
  tableBtn.className = 'likha-button-wrapper';
  tableBtn.style.position = 'relative';
  tableBtn.style.display = 'inline-block';

  const tableBtnInner = new Button({
    icon: icons.table,
    title: 'Insert Table',
    onClick: (e) => {
      e.stopPropagation();
      // Toggle grid visibility
      if (tableGridContainer.style.display === 'block') {
        tableGridContainer.style.display = 'none';
      } else {
        tableGridContainer.style.display = 'block';
      }
    }
  });

  const tableGridContainer = document.createElement('div');
  tableGridContainer.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    display: none;
    z-index: 1000;
  `;

  const tableGridSelector = new TableGrid({
    maxRows: 10,
    maxCols: 10,
    onSelect: (rows: number, cols: number) => {
      editor.executeCommand('insertTable', rows, cols);
      tableGridContainer.style.display = 'none';
      editor.view.focus();
    }
  });

  tableGridContainer.appendChild(tableGridSelector.getElement());
  tableBtn.appendChild(tableBtnInner.getElement());
  tableBtn.appendChild(tableGridContainer);

  // Close grid when clicking outside
  document.addEventListener('click', (e) => {
    if (!tableBtn.contains(e.target as Node)) {
      tableGridContainer.style.display = 'none';
    }
  });

  const hrBtn = new Button({
    icon: icons.hr,
    title: 'Insert Horizontal Rule',
    onClick: () => {
      editor.executeCommand('insertHorizontalRule');
    }
  });

  toolbar.addGroup([imageBtn.getElement(), tableBtn, hrBtn.getElement()]);
  toolbar.addSeparator();

  // ADVANCED GROUP (Code, Colors, Source)
  const codeBtn = new Button({
    icon: icons.code,
    title: 'Code Block',
    onClick: () => {
      editor.executeCommand('toggleCodeBlock');
    }
  });

  const colorBtn = new Button({
    icon: icons.color,
    title: 'Text Color',
    onClick: (e) => {
      e.stopPropagation();
      showColorPicker(e.currentTarget as HTMLElement, (color) => {
        editor.executeCommand('setTextColor', color);
      });
    }
  });

  const highlightBtn = new Button({
    icon: icons.highlight,
    title: 'Highlight',
    onClick: (e) => {
      e.stopPropagation();
      showColorPicker(e.currentTarget as HTMLElement, (color) => {
        editor.executeCommand('setHighlight', color);
      });
    }
  });

  const sourceViewBtn = new Button({
    icon: icons.sourceCode,
    title: 'HTML Source View',
    onClick: () => {
      editor.executeCommand('toggleSourceView');
    },
    isActive: () => editor.executeCommand('isSourceViewActive') as boolean
  });

  toolbar.addGroup([codeBtn.getElement(), colorBtn.getElement(), highlightBtn.getElement()]);
  toolbar.addSeparator();
  
  toolbar.addButton(sourceViewBtn.getElement());

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
